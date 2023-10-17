declare module '*.vue' {
  export interface GlobalComponents {
    SFCButton: typeof import('./index').SFCButton
    JSXButton: typeof import('./index').JSXButton
  }
}
