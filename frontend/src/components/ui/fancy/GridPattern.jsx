export const GridPattern = ({ width = 40, height = 40, x = -1, y = -1, strokeDasharray = 0, className, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 h-full w-full fill-gray-50/30 stroke-gray-200 [mask-image:linear-gradient(to_bottom_right,white,transparent_70%)] ${className}`}
            {...props}
        >
            <defs>
                <pattern
                    id="grid-pattern"
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path d={`M.5 ${height}V.5H${width}`} fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
        </svg>
    );
};
