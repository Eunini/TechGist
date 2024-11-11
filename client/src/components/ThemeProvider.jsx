import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={theme}>
      <div
        className="text-gray-700 dark:text-gray-300 min-h-screen"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #00022E, #00022E, #00022E)' // Dark theme gradient
            : 'linear-gradient(135deg, #87CEEB, #ADD8E6, #87CEEB)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
