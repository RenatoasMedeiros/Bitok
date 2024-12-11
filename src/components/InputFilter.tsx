// src/components/InputFilter.tsx
import React, { FC, useState, useEffect, useCallback } from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { debounce } from 'lodash';

interface InputFilterProps extends TextInputProps {
  placeholder?: string;
  initialValue?: string;
  debounceTime?: number;
  onFilterChange: (text: string) => void; // Callback triggered after debounce
}

const InputFilter: FC<InputFilterProps> = ({
  placeholder = "Search...",
  initialValue = "",
  debounceTime = 500,
  onFilterChange,
  
}) => {
  const [value, setValue] = useState(initialValue);

  // Create a debounced callback to delay filter application
  const debouncedFilter = useCallback(
    debounce((text: string) => {
      onFilterChange(text);
    }, debounceTime),
    [debounceTime, onFilterChange]
  );

  const handleChangeText = (text: string) => {
    setValue(text);
    debouncedFilter(text);
  };

  useEffect(() => {
    // Cleanup the debounce on unmount
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fafafa'
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff'
  }
});

export default InputFilter;
