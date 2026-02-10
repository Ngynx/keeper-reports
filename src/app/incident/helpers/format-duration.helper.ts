export const formatDuration = (t: number): string => {  
    const cd = 24 * 60 * 60 * 1000;
    const ch = 60 * 60 * 1000;
    const cm = 60 * 1000;
    
    const d = Math.floor(t / cd);
    const h = Math.floor((t - d * cd) / ch);
    const m = Math.floor((t - d * cd - h * ch) / cm);
    const s = Math.round((t - d * cd - h * ch - m * cm) / 1000);
    
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return [d + "d", pad(h) + "h", pad(m) + "m", pad(s) + "s"].join(' ');
};