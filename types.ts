
export interface Page {
  name: string;
  html: string;
}

export interface GeneratedCode {
  pages: Page[];
  css: string;
}
