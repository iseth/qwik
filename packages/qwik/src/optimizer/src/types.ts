/**
 * @public
 */
export interface Optimizer {
  /**
   * Transforms the input code string, does not access the file system.
   */
  transformModules(opts: TransformModulesOptions): Promise<TransformOutput>;

  /**
   * Transforms the input code string, does not access the file system.
   */
  transformModulesSync(opts: TransformModulesOptions): TransformOutput;

  /**
   * Transforms the directory from the file system.
   */
  transformFs(opts: TransformFsOptions): Promise<TransformOutput>;

  /**
   * Transforms the directory from the file system.
   */
  transformFsSync(opts: TransformFsOptions): TransformOutput;

  /**
   * Optimizer system use. This can be updated with a custom file system.
   */
  sys: OptimizerSystem;
}

/**
 * @public
 */
export interface OptimizerOptions {
  sys?: OptimizerSystem;
  binding?: any;
}

/**
 * @public
 */
export interface OptimizerSystem {
  cwd: () => string;
  env: SystemEnvironment;
  os: string;
  dynamicImport: (path: string) => Promise<any>;
  strictDynamicImport: (path: string) => Promise<any>;
  getInputFiles?: (rootDir: string) => Promise<TransformModuleInput[]>;
  path: Path;
}

/**
 * @public
 */
export type SystemEnvironment = 'node' | 'deno' | 'webworker' | 'browsermain' | 'unknown';

// OPTIONS ***************

/**
 * @public
 */
export type SourceMapsOption = 'external' | 'inline' | undefined | null;

/**
 * @public
 */
export type TranspileOption = boolean | undefined | null;

/**
 * @public
 */
export interface TransformOptions {
  srcDir: string;
  rootDir?: string;
  entryStrategy?: EntryStrategy;
  minify?: MinifyMode;
  sourceMaps?: boolean;
  transpileTs?: boolean;
  transpileJsx?: boolean;
  preserveFilenames?: boolean;
  explicitExtensions?: boolean;
  mode?: EmitMode;
  scope?: string;
  stripExports?: string[];
  regCtxName?: string[];
  stripCtxName?: string[];
  stripEventHandlers?: boolean;
  isServer?: boolean;
}

/**
 * @public
 */
export interface TransformModulesOptions extends TransformOptions {
  input: TransformModuleInput[];
}

/**
 * @public
 */
export interface TransformFsOptions extends TransformOptions {
  vendorRoots: string[];
}

// OPTION INPUTS ***************

/**
 * @public
 */
export interface TransformModuleInput {
  path: string;
  code: string;
}

// RESULT ***************

/**
 * @public
 */
export interface TransformOutput {
  modules: TransformModule[];
  diagnostics: Diagnostic[];
  isTypeScript: boolean;
  isJsx: boolean;
}

/**
 * @public
 */
export interface HookAnalysis {
  origin: string;
  name: string;
  entry: string | null;
  displayName: string;
  hash: string;
  canonicalFilename: string;
  extension: string;
  parent: string | null;
  ctxKind: 'event' | 'function';
  ctxName: string;
  captures: boolean;
}

// RESULT OUTPUT ***************

/**
 * @public
 */
export interface TransformModule {
  path: string;
  isEntry: boolean;
  code: string;
  map: string | null;
  hook: HookAnalysis | null;
}

// DIAGNOSTICS ***************

/**
 * @public
 */
export interface Diagnostic {
  scope: string;
  category: DiagnosticCategory;
  code: string | null;
  file: string;
  message: string;
  highlights: SourceLocation[];
  suggestions: string[] | null;
}

/**
 * @public
 */
export interface SourceLocation {
  hi: number;
  lo: number;
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
}

/**
 * @public
 */
export type DiagnosticCategory = 'error' | 'warning' | 'sourceError';

// ENTRY STRATEGY ***************

/**
 * @public
 */
export type EntryStrategy =
  | InlineEntryStrategy
  | HoistEntryStrategy
  | SingleEntryStrategy
  | HookEntryStrategy
  | ComponentEntryStrategy
  | SmartEntryStrategy;

/**
 * @public
 */
export type MinifyMode = 'simplify' | 'none';

/**
 * @public
 */
export type EmitMode = 'dev' | 'prod' | 'lib';

/**
 * @public
 */
export interface InlineEntryStrategy {
  type: 'inline';
}

/**
 * @public
 */
export interface HoistEntryStrategy {
  type: 'hoist';
}

/**
 * @public
 */
export interface HookEntryStrategy {
  type: 'hook';
  manual?: Record<string, string>;
}

/**
 * @public
 */
export interface SingleEntryStrategy {
  type: 'single';
  manual?: Record<string, string>;
}

/**
 * @public
 */
export interface ComponentEntryStrategy {
  type: 'component';
  manual?: Record<string, string>;
}

/**
 * @public
 */
export interface SmartEntryStrategy {
  type: 'smart';
  manual?: Record<string, string>;
}

/**
 * @public
 */
export interface QwikManifest {
  symbols: { [symbolName: string]: QwikSymbol };
  mapping: { [symbolName: string]: string };
  bundles: { [fileName: string]: QwikBundle };
  injections?: GlobalInjections[];
  version: string;
  options?: {
    target?: string;
    buildMode?: string;
    entryStrategy?: { [key: string]: any };
  };
  platform?: { [name: string]: string };
}

/**
 * @public
 */
export type SymbolMapper = Record<string, readonly [symbol: string, chunk: string]>;

/**
 * @public
 */
export type SymbolMapperFn = (
  symbolName: string,
  mapper: SymbolMapper | undefined
) => readonly [symbol: string, chunk: string] | undefined;

/**
 * @public
 */
export interface QwikSymbol {
  origin: string;
  displayName: string;
  hash: string;
  canonicalFilename: string;
  ctxKind: 'function' | 'event';
  ctxName: string;
  captures: boolean;
  parent: string | null;
}

/**
 * @public
 */
export interface QwikBundle {
  size: number;
  symbols?: string[];
  imports?: string[];
  dynamicImports?: string[];
  origins?: string[];
}

/**
 * @public
 */
export interface GlobalInjections {
  tag: string;
  attributes?: { [key: string]: string };
  location: 'head' | 'body';
}

export interface GeneratedOutputBundle {
  fileName: string;
  modules: {
    [id: string]: any;
  };
  imports: string[];
  dynamicImports: string[];
  size: number;
}

// PATH UTIL  ***************

/**
 * @public
 */
export interface Path {
  resolve(...paths: string[]): string;
  normalize(path: string): string;
  isAbsolute(path: string): boolean;
  join(...paths: string[]): string;
  relative(from: string, to: string): string;
  dirname(path: string): string;
  basename(path: string, ext?: string): string;
  extname(path: string): string;
  format(pathObject: {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  }): string;
  parse(path: string): {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  };
  readonly sep: string;
  readonly delimiter: string;
  readonly win32: null;
  readonly posix: Path;
}

/**
 * @public
 */
export interface ResolvedManifest {
  mapper: SymbolMapper;
  manifest: QwikManifest;
}
