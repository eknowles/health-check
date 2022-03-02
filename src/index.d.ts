export interface IPhinOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data: string;
  form: string;
}

declare module 'phin' {
  promisified: (options, http): Promise<any> => {};
}

export interface Global extends NodeJS.Global {
  messages: {
    [locale: string]: string;
  };
}

declare var global: Global;
