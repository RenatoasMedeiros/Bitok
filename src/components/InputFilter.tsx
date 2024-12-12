// src/components/InputFilter.tsx

import React, { FC, useState, useEffect, useCallback } from 'react';
import { 
  TextInput, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  Animated, 
  Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure react-native-vector-icons is installed
import { debounce } from 'lodash';
import { 
  addOrUpdateCategoryPreference, 
  addOrUpdatePriceRangePreference 
} from '../utils/preferences';

interface InputFilterProps extends TextInputProps {
  placeholder?: string;
  initialValue?: string;
  debounceTime?: number;
  onCategoryChange: (text: string) => void; // Callback for category changes
  onPriceChange: (price: string) => void; // Callback for price changes
  onReset: () => void; // Callback for reset preferences
}

const priceOptions = ['€', '€€', '€€€'];

const InputFilter: FC<InputFilterProps> = ({
  placeholder = "Search Categories...",
  initialValue = "",
  debounceTime = 500,
  onCategoryChange,
  onPriceChange,
  onReset,
}) => {
  const [value, setValue] = useState(initialValue);
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [expanded, setExpanded] = useState<boolean>(false);
  const [animation] = useState(new Animated.Value(0));

  // Debounced function for handling category text input changes
  const debouncedCategoryChange = useCallback(
    debounce((text: string) => {
      onCategoryChange(text);
      // Save the search term as a category preference
      if (text.trim().length > 0) {
        addOrUpdateCategoryPreference(text.trim());
      }
    }, debounceTime),
    [debounceTime, onCategoryChange]
  );

  const handleCategoryChange = (text: string) => {
    setValue(text);
    debouncedCategoryChange(text);
  };

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePriceSelect = (price: string) => {
    const newSelectedPrice = selectedPrice === price ? '' : price; // Toggle selection
    setSelectedPrice(newSelectedPrice);
    if (newSelectedPrice !== "") {
      addOrUpdatePriceRangePreference(newSelectedPrice);
    }
    onPriceChange(newSelectedPrice); // Trigger price filter change
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // Adjust the height as needed to accommodate buttons and reset
  });

  return (
    <View style={styles.container}>
      {/* Category Input */}
      <TouchableOpacity activeOpacity={1} onPress={toggleExpand}>
        <View style={styles.inputWithIcon}>
          <Icon name="search" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={handleCategoryChange}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={toggleExpand}
          />
          <Icon 
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="#666" 
            style={styles.icon} 
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Section: Price Buttons and Reset Button */}
      <Animated.View style={[styles.expandedContainer, { height: heightInterpolate }]}>
        <View style={styles.priceButtonsContainer}>
          {priceOptions.map((priceOption) => (
            <TouchableOpacity
              key={priceOption}
              style={[
                styles.priceButton, 
                selectedPrice === priceOption && styles.selectedPriceButton
              ]}
              onPress={() => handlePriceSelect(priceOption)}
              accessibilityLabel={`Filter by price ${priceOption}`}
            >
              <Text 
                style={[
                  styles.priceButtonText, 
                  selectedPrice === priceOption && styles.selectedPriceButtonText
                ]}
              >
                {priceOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reset Preferences Button */}
        <TouchableOpacity style={styles.resetButton} onPress={onReset} accessibilityLabel="Reset Preferences">
          <Text style={styles.resetButtonText}>Reset Preferences</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'android' ? 0 : 10,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Platform.OS === 'android' ? 10 : 5,
  },
  expandedContainer: {
    overflow: 'hidden',
    marginTop: 10,
  },
  priceButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    alignItems: 'center',
  },
  selectedPriceButton: {
    backgroundColor: '#4caf50',
  },
  priceButtonText: {
    color: '#000',
    fontSize: 16,
  },
  selectedPriceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default InputFilter;
