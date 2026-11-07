export const T = (zh, en) => ({ 'zh-CN': zh, en });
export const I = (zh, en, detailZh, detailEn) => ({ label: T(zh,en), ...(detailZh ? { detail: T(detailZh,detailEn) } : {}) });
export const S = (type, zh, en, extra = {}) => ({ type, title: T(zh,en), ...extra });
export const sub = (zh,en) => ({subtitle:T(zh,en)});
export const src = (number, extra = {}) => ({ sourceSlide:number, ...extra });
