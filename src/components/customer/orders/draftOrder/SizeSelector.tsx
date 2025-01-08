import React, { useState, ChangeEvent, useEffect } from "react";
import { IoAdd, IoRemove, IoChevronDown } from "react-icons/io5";

interface SizeSelectorProps {
  value: string;
  onChange: (sizeString: string) => void;
  className?: string;
}

// Parse the initial value string to extract pages/words
const parseValueString = (
  value: string
): {
  pages: string;
  words: string;
  spacing: LineSpacingType;
} | null => {
  if (!value) return null;

  const match = value.match(
    /(\d+\.?\d*) pages, (\d+) words, (Single|Double) space/
  );
  if (!match) return null;

  return {
    pages: match[1],
    words: match[2],
    spacing: match[3] as LineSpacingType,
  };
};

type LineSpacingType = "Single" | "Double";
type ModeType = "Pages" | "Words";

const WORDS_INCREMENT = 25;
const PAGES_INCREMENT = 1;

const SizeSelector: React.FC<SizeSelectorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [mode, setMode] = useState<ModeType>("Words");
  const [inputValue, setInputValue] = useState<string>("275");
  const [lineSpacing, setLineSpacing] = useState<LineSpacingType>("Double");
  const [showSpacingOptions, setShowSpacingOptions] = useState<boolean>(false);

  // Updated conversion functions with line spacing consideration
  const wordsToPages = (words: string, spacing: LineSpacingType): string => {
    const numWords = parseFloat(words);
    return isNaN(numWords)
      ? "0"
      : spacing === "Double"
      ? (numWords / 275).toFixed(1)
      : (numWords / 550).toFixed(1);
  };

  const pagesToWords = (pages: string, spacing: LineSpacingType): string => {
    const numPages = parseFloat(pages);
    return isNaN(numPages)
      ? "0"
      : spacing === "Double"
      ? Math.round(numPages * 275).toString()
      : Math.round(numPages * 550).toString();
  };

  // Handle initial value and spacing
  useEffect(() => {
    const parsed = parseValueString(value);
    if (parsed) {
      setLineSpacing(parsed.spacing);
      // Set the input value based on current mode
      setInputValue(mode === "Pages" ? parsed.pages : parsed.words);
    }
  }, [mode, value]); // Only depend on value, not mode or lineSpacing

  // Updated line spacing handler
  const handleLineSpacingChange = (newSpacing: LineSpacingType) => {
    if (newSpacing === lineSpacing) return;

    // Convert current value to pages (neutral format)
    let pagesValue: string;
    if (mode === "Pages") {
      pagesValue = inputValue;
    } else {
      pagesValue = wordsToPages(inputValue, lineSpacing);
    }

    // Update line spacing
    setLineSpacing(newSpacing);

    // Convert back to current mode with new spacing
    if (mode === "Pages") {
      setInputValue(pagesValue);
    } else {
      setInputValue(pagesToWords(pagesValue, newSpacing));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleIncrement = (): void => {
    const currentValue = parseFloat(inputValue) || 0;
    if (mode === "Pages") {
      setInputValue((currentValue + PAGES_INCREMENT).toString());
    } else {
      setInputValue((currentValue + WORDS_INCREMENT).toString());
    }
  };

  const handleDecrement = (): void => {
    const currentValue = parseFloat(inputValue) || 0;
    if (mode === "Pages") {
      setInputValue(Math.max(currentValue - PAGES_INCREMENT, 0).toString());
    } else {
      setInputValue(Math.max(currentValue - WORDS_INCREMENT, 0).toString());
    }
  };

  // Mode toggle handler
  const handleModeToggle = (newMode: ModeType): void => {
    if (newMode === mode) return;

    const currentValue = inputValue || "0";
    let newValue: string;

    if (newMode === "Words") {
      newValue = pagesToWords(currentValue, lineSpacing);
    } else {
      newValue = wordsToPages(currentValue, lineSpacing);
    }

    setInputValue(newValue);
    setMode(newMode);
  };

  const handleSave = (): void => {
    if (!inputValue) return;

    let pages: string;
    let words: string;

    if (mode === "Pages") {
      pages = inputValue;
      words = pagesToWords(inputValue, lineSpacing);
    } else {
      words = inputValue;
      pages = wordsToPages(inputValue, lineSpacing);
    }

    const sizeString = `${parseFloat(pages).toFixed(1)} pages, ${Math.round(
      parseFloat(words)
    )} words, ${lineSpacing} space`;
    onChange(sizeString);
  };

  return (
    <div className={`p-4 space-y-4 ${className}`}>
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Size</label>

        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => handleModeToggle("Pages")}
            className={`px-4 py-2 text-sm rounded-l-md border ${
              mode === "Pages"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Pages
          </button>
          <button
            type="button"
            onClick={() => handleModeToggle("Words")}
            className={`px-4 py-2 text-sm rounded-r-md border-t border-r border-b ${
              mode === "Words"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Words
          </button>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={handleDecrement}
                className="absolute left-2 text-gray-500 hover:text-gray-700"
              >
                <IoRemove className="text-xl" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full px-8 py-2 border rounded-md text-center"
                placeholder="0"
              />
              <button
                type="button"
                onClick={handleIncrement}
                className="absolute right-2 text-gray-500 hover:text-gray-700"
              >
                <IoAdd className="text-xl" />
              </button>
            </div>
            {inputValue && mode === "Words" && (
              <p className="text-sm text-gray-500 mt-1">
                ~{wordsToPages(inputValue, lineSpacing)} pages
              </p>
            )}
            {inputValue && mode === "Pages" && (
              <p className="text-sm text-gray-500 mt-1">
                ~{pagesToWords(inputValue, lineSpacing)} words
              </p>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSpacingOptions(!showSpacingOptions)}
              className="w-48 px-4 py-2 border rounded-md flex items-center justify-between bg-white"
            >
              <span>{lineSpacing}</span>
              <IoChevronDown className="text-xl" />
            </button>

            {showSpacingOptions && (
              <div className="absolute z-10 w-48 mt-1 bg-white border rounded-md shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    handleLineSpacingChange("Single");
                    setShowSpacingOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Single
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLineSpacingChange("Double");
                    setShowSpacingOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Double
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
      >
        Save
        <IoChevronDown className="ml-2 text-xl" />
      </button>
    </div>
  );
};

export default SizeSelector;
