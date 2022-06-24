import { task, series } from 'gulp';
import { resolve, join } from 'path';
import {
  deleteDir,
  compileTypeScript,
  copyFilesAsync,
  normalizeCompilerOptions,
  IRollupBundleConfig,
  loadPackageJson,
  createRollupBundle,
  modifyFile,
  lintESLint
} from '@tylertech/forge-build-tools';
import { chmodSync } from 'fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const ROOT = resolve(__dirname, './');
const SRC_ROOT = join(ROOT, 'src');
const DIST_ROOT = join(ROOT, 'dist');
const BUILD_ROOT = join(DIST_ROOT, '.temp');

const packageJson = loadPackageJson(ROOT);
const tsconfig = require(join(ROOT, 'tsconfig.json'));
const BUNDLE_FILE_NAME = 'forge-testing';
const ROLLUP_GLOBALS = {
  '@tylertech/forge-core': '@tylertech/forge-core',
  'tslib': 'tslib'
};
const BANNER = `/**
* @license
* Copyright (c) ${new Date().getFullYear()} Tyler Technologies, Inc.
* License: Apache-2.0
*/`;

/** Cleans the build output directory. */
task('clean', () => deleteDir(DIST_ROOT));

/** Lints the code in the project. */
task('lint', () => lintESLint(join(SRC_ROOT, '**/*.ts')));

/** Compiles the TypeScript files in the source directory to the build output directory. */
task('compile:ts', () => compileTypeScript(join(SRC_ROOT, '**/*.ts'), join(ROOT, 'tsconfig.json')));

/** Creates the rollup bundles. */
task('generate:bundles', async () => {
  // First we compile the TypeScript
  await compileTypeScriptTask('es2015', 'es2015', true);

  // Now we create the commonjs rollup bundle
  let rollupConfig: IBundleConfig = {
    name: BUNDLE_FILE_NAME,
    input: join(BUILD_ROOT, 'index.js'),
    file: join(DIST_ROOT, `dist/${BUNDLE_FILE_NAME}.cjs`),
    format: 'cjs',
    version: packageJson.version,
    minify: false
  };
  await createRollupBundleTask(rollupConfig, ROLLUP_GLOBALS);

  // Create ES module bundle
  rollupConfig = {
    name: BUNDLE_FILE_NAME,
    input: join(BUILD_ROOT, 'index.js'),
    file: join(DIST_ROOT, `dist/${BUNDLE_FILE_NAME}.mjs`),
    format: 'es',
    version: packageJson.version,
    minify: false
  };
  await createRollupBundleTask(rollupConfig, ROLLUP_GLOBALS);

  // Clean up
  await deleteDir(BUILD_ROOT);
});

/** Copies the package.json to the build output directory. */
task('copy', () => {
  const files = [
    join(ROOT, 'package.json'),
    join(ROOT, 'README.md'),
    join(ROOT, 'LICENSE')
  ];
  return copyFilesAsync(files, ROOT, DIST_ROOT);
});

/** Adjusts the package.json to prepare it for public distribution. */
task('fixup:packageJson', async () => {
  const packageJsonPath = join(DIST_ROOT, 'package.json');
  chmodSync(packageJsonPath, 0o777);
  await modifyFile(packageJsonPath, info => {
    const json = JSON.parse(info.contents);
    delete json.devDependencies;
    delete json.scripts;
    return JSON.stringify(json, null, 2);
  });
});

/** The main build task that generates the npm package. */
task('build', series('clean', 'lint', 'generate:bundles', 'copy', 'fixup:packageJson'));

export interface IBundleConfig {
  input: string;
  name: string;
  format: 'es' | 'cjs';
  file: string;
  version: string;
  minify: boolean;
}

async function createRollupBundleTask(rollupConfig: IBundleConfig, rollupGlobals: { [key: string]: string }): Promise<void> {
  const bundleConfig: IRollupBundleConfig = {
    input: rollupConfig.input,
    name: rollupConfig.name,
    format: rollupConfig.format,
    file: rollupConfig.file,
    version: rollupConfig.version,
    minify: rollupConfig.minify,
    globals: rollupGlobals,
    banner: BANNER,
    plugins: [
      nodeResolve(),
      commonjs()
    ]
  };

  await createRollupBundle(bundleConfig);
}

async function compileTypeScriptTask(target: string, mod: string, declaration?: boolean): Promise<void> {
  const compilerOptions = normalizeCompilerOptions(tsconfig.compilerOptions) as any;
  compilerOptions.target = target;
  compilerOptions.module = mod;
  compilerOptions.outDir = BUILD_ROOT;
  
  if (declaration) {
    compilerOptions.declaration = true;
    compilerOptions.declarationDir = join(DIST_ROOT, 'typings');
  }

  return compileTypeScript(join(SRC_ROOT, '**/*.ts'), compilerOptions);
}
