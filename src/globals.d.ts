declare module '*.css' {
  const styles: { [k: string]: string }
  export default styles
}

declare module '*.svg' {
  const content: any
  export default content
}
