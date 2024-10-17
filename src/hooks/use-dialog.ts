import { useCallback, useState } from "react";

export function useDialog<T>() {
  const [state, setState] = useState<{ open: boolean; data?: T }>({
    open: false,
    data: undefined,
  });

  const handleOpen = useCallback((data?: T) => {
    setState({
      open: true,
      data,
    });
  }, []);

  const handleClose = useCallback(() => {
    setState({
      open: false,
    });
  }, []);

  return {
    data: state.data,
    handleClose,
    handleOpen,
    open: state.open,
  };
}
