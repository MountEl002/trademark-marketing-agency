import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { IoAdd, IoRemove, IoChevronDown } from "react-icons/io5";

interface SizeSelectorProps {
  value: string;
  onChange: (sizeString: string) => void;
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

const SizeSelector: React.FC<SizeSelectorProps> = ({ value, onChange }) => {
  const [mode, setMode] = useState<ModeType>("Words");
  const [inputValue, setInputValue] = useState<string>("275");
  const [lineSpacing, setLineSpacing] = useState<LineSpacingType>("Double");
  const [showSpacingOptions, setShowSpacingOptions] = useState<boolean>(false);
  const [sizeInputFocus, setSizeInputFocus] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

    const sizeString = `${Math.round(parseFloat(words))} words, (~ ${parseFloat(
      pages
    ).toFixed(1)} pages), ${lineSpacing} spacing`;
    onChange(sizeString);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSpacingOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="vertical-start p-4">
      <label className="order-form-field-title">Size</label>
      <div className="flex flex-col md:flex-row items-center justify-start gap-8 md:gap-3 mt-6 mb-12 w-full">
        {/* Page/words toggle */}
        <div className="horizontal w-full rounded-lg p-0.5 bg-gray-200">
          <button
            type="button"
            onClick={() => handleModeToggle("Pages")}
            className={`w-full py-2 rounded-lg text-sm transition-all duration-500 ${
              mode === "Pages" ? "text-blue-500 bg-gray-300" : "text-gray-500"
            }`}
          >
            Pages
          </button>
          <button
            type="button"
            onClick={() => handleModeToggle("Words")}
            className={`w-full py-2 rounded-lg text-sm transition-all duration-500 ${
              mode === "Words" ? "text-blue-500 bg-gray-300" : "text-gray-500"
            }`}
          >
            Words
          </button>
        </div>

        {/* Input words/pages */}
        <div
          className={`relative horizontal-space-between w-full rounded-lg transition-all duration-500 ${
            sizeInputFocus
              ? "bg-gray-100 border border-blue-500"
              : "bg-gray-200"
          }`}
        >
          <button
            type="button"
            onClick={handleDecrement}
            className="text-gray-500 p-2 hover:text-gray-700"
          >
            <IoRemove className="text-xl" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setSizeInputFocus(true)}
            className="focus:outline-none w-full text-center p-2 bg-transparent"
            placeholder="0"
          />
          <button
            type="button"
            onClick={handleIncrement}
            className="text-gray-500 p-2 hover:text-gray-700"
          >
            <IoAdd className="text-xl" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-8">
            {inputValue && mode === "Words" && (
              <p className="text-sm text-gray-400 mt-1">
                ~ {wordsToPages(inputValue, lineSpacing)} pages
              </p>
            )}
            {inputValue && mode === "Pages" && (
              <p className="text-sm text-gray-400 mt-1">
                ~ {pagesToWords(inputValue, lineSpacing)} words
              </p>
            )}
          </div>
        </div>

        {/* Toggle line spacing */}
        <div ref={containerRef} className="w-full">
          <button
            type="button"
            onClick={() => setShowSpacingOptions(!showSpacingOptions)}
            className={`w-full px-4 py-2 border rounded-md flex items-center justify-between transition-all duration-500 ${
              showSpacingOptions ? "bg-gray-50" : "bg-gray-200"
            }`}
          >
            <span>{lineSpacing}</span>
            <IoChevronDown
              className={`text-xl transition-all duration-500 ${
                showSpacingOptions ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {showSpacingOptions && (
            <div className="absolute z-[65] mt-1 bg-gray-200 border rounded-md shadow-lg p-1">
              <button
                type="button"
                onClick={() => {
                  handleLineSpacingChange("Single");
                  setShowSpacingOptions(false);
                }}
                className={`w-full px-4 py-2 text-left mb-1 rounded-lg transition-all duration-500 ${
                  lineSpacing === "Single"
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                    : "hover:bg-gray-100"
                }`}
              >
                Single
              </button>
              <button
                type="button"
                onClick={() => {
                  handleLineSpacingChange("Double");
                  setShowSpacingOptions(false);
                }}
                className={`w-full px-4 py-2 text-left rounded-lg transition-all duration-500 ${
                  lineSpacing === "Double"
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                    : "hover:bg-gray-100"
                }`}
              >
                Double
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="horizontal w-full mt-6">
        <button
          type="button"
          onClick={() => {
            handleSave();
            setSizeInputFocus(false);
          }}
          className="w-fit pl-24 p-0.5 group bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          Save
          <IoChevronDown
            size={30}
            className="ml-20 text-white rounded-sm transition-all duration-500 bg-blue-400 group-hover:bg-blue-500"
          />
        </button>
      </div>
    </div>
  );
};

export default SizeSelector;
