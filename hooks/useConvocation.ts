import { useState, useCallback } from 'react';
import { SpecialistId, ConvocationState } from '@/types';

export function useConvocation() {
  const [state, setState] = useState<ConvocationState>({
    isOpen: false,
    selectedIds: [],
    isGroup: false,
  });

  const toggleSpecialist = useCallback((id: SpecialistId, isShiftPressed: boolean) => {
    setState((prev) => {
      if (isShiftPressed) {
        // Group selection logic
        const isSelected = prev.selectedIds.includes(id);
        let newSelection = [...prev.selectedIds];

        if (isSelected) {
          newSelection = newSelection.filter((sId) => sId !== id);
        } else if (newSelection.length < 3) {
          newSelection.push(id);
        }

        return {
          isOpen: prev.isOpen,
          selectedIds: newSelection,
          isGroup: newSelection.length > 1,
        };
      } else {
        // Single selection logic
        return {
          isOpen: true,
          selectedIds: [id],
          isGroup: false,
        };
      }
    });
  }, []);

  const openGroupConvocation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
    }));
  }, []);

  const closeConvocation = useCallback(() => {
    setState({
      isOpen: false,
      selectedIds: [],
      isGroup: false,
    });
  }, []);

  return { state, toggleSpecialist, openGroupConvocation, closeConvocation };
}
