const cx = (...classes: unknown[]) => classes.filter(Boolean).join(' ');

export default cx;