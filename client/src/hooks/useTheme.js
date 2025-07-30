import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme as toggleThemeAction } from '../redux/theme/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  return { theme, toggleTheme };
};
