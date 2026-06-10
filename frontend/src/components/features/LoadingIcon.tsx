interface PropsType {
  width: number;
  height: number;
  spin?: boolean;
}

export function LoadingIcon({ width, height, spin = true }: Readonly<PropsType>) {
  return (
    <div className={`${spin ? 'animate-spin' : ''}`}>
      <svg fill="none" viewBox="0 0 24 24" width={width} height={height}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}
