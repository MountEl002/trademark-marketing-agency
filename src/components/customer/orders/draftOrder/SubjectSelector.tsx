// components/common/AssignmentTypeSelector.tsx
import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

interface SubjectOption {
  id: string;
  name: string;
  category:
    | "Arts"
    | "Business administration"
    | "Computer science"
    | "Economics"
    | "Education"
    | "Engineering"
    | "English and Literature"
    | "Health and life sciences"
    | "History"
    | "Humanities"
    | "Legal"
    | "Marketing"
    | "Mathematics and statistics"
    | "Natural sciences"
    | "Philosophy"
    | "Political sciences"
    | "Social sciences";
}

interface PopularButtons {
  id: number;
  name: string;
}

interface SubjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SubjectOptions: SubjectOption[] = [
  // Arts category
  { id: "1", name: "Art", category: "Arts" },
  { id: "2", name: "Dance", category: "Arts" },
  { id: "3", name: "Design and modelling", category: "Arts" },
  {
    id: "4",
    name: "Drama and theater",
    category: "Arts",
  },
  { id: "5", name: "Fashion", category: "Arts" },
  { id: "6", name: "Music", category: "Arts" },
  { id: "7", name: "Painting", category: "Arts" },
  { id: "8", name: "Photography", category: "Arts" },
  { id: "9", name: "Visual arts", category: "Arts" },

  // Business administration category
  {
    id: "10",
    name: "Accounting",
    category: "Business administration",
  },
  {
    id: "11",
    name: "Business and management",
    category: "Business administration",
  },
  {
    id: "12",
    name: "Employee welfare",
    category: "Business administration",
  },
  { id: "13", name: "Entrepreneurship", category: "Business administration" },
  {
    id: "14",
    name: "Hospitality managment",
    category: "Business administration",
  },
  {
    id: "15",
    name: "Leadership",
    category: "Business administration",
  },
  {
    id: "16",
    name: "Logistics",
    category: "Business administration",
  },
  {
    id: "17",
    name: "Occupational safety and health administration",
    category: "Business administration",
  },

  // Computer science category
  {
    id: "18",
    name: "C#",
    category: "Computer science",
  },
  {
    id: "19",
    name: "C++",
    category: "Computer science",
  },
  {
    id: "20",
    name: "Code",
    category: "Computer science",
  },
  {
    id: "21",
    name: "Computer science",
    category: "Computer science",
  },
  {
    id: "22",
    name: "Cryptography",
    category: "Computer science",
  },
  {
    id: "23",
    name: "Cybersecurity",
    category: "Computer science",
  },
  {
    id: "24",
    name: "Digital science",
    category: "Computer science",
  },
  {
    id: "25",
    name: "Information technology (IT)",
    category: "Computer science",
  },
  {
    id: "26",
    name: "Java",
    category: "Computer science",
  },
  {
    id: "27",
    name: "JavaScript",
    category: "Computer science",
  },
  {
    id: "28",
    name: "PHP",
    category: "Computer science",
  },
  {
    id: "29",
    name: "Programming",
    category: "Computer science",
  },
  {
    id: "30",
    name: "Python",
    category: "Computer science",
  },
  {
    id: "31",
    name: "Sofware and applications",
    category: "Computer science",
  },
  {
    id: "32",
    name: "SQL",
    category: "Computer science",
  },
  {
    id: "33",
    name: "Web design",
    category: "Computer science",
  },

  // Economics category
  {
    id: "34",
    name: "Agriculture",
    category: "Economics",
  },
  {
    id: "35",
    name: "Economics",
    category: "Economics",
  },
  {
    id: "36",
    name: "Finance",
    category: "Economics",
  },
  {
    id: "37",
    name: "Investing and financial markets",
    category: "Economics",
  },

  // Education category
  {
    id: "38",
    name: "Apllication writing",
    category: "Education",
  },
  {
    id: "39",
    name: "Application and forms",
    category: "Education",
  },
  {
    id: "40",
    name: "Creative writing",
    category: "Education",
  },
  {
    id: "41",
    name: "Education",
    category: "Education",
  },
  {
    id: "42",
    name: "Research methods",
    category: "Education",
  },
  {
    id: "43",
    name: "Scholarship writing",
    category: "Education",
  },
  {
    id: "44",
    name: "Sex education",
    category: "Education",
  },
  {
    id: "45",
    name: "Special education",
    category: "Education",
  },
  {
    id: "46",
    name: "Study design",
    category: "Education",
  },
  {
    id: "47",
    name: "Writing",
    category: "Education",
  },

  // Engineering category
  {
    id: "48",
    name: "Architecture",
    category: "Engineering",
  },
  {
    id: "49",
    name: "Aviation",
    category: "Engineering",
  },
  {
    id: "50",
    name: "Engineering",
    category: "Engineering",
  },
  {
    id: "51",
    name: "Innovation and technology",
    category: "Engineering",
  },
  {
    id: "52",
    name: "Technology",
    category: "Engineering",
  },
  {
    id: "53",
    name: "Telecommunications",
    category: "Engineering",
  },
  {
    id: "54",
    name: "Urban and environmental planning",
    category: "Engineering",
  },

  // English and Literature category
  {
    id: "55",
    name: "American literature",
    category: "English and Literature",
  },
  {
    id: "56",
    name: "Ancient Literature",
    category: "English and Literature",
  },
  {
    id: "57",
    name: "English",
    category: "English and Literature",
  },
  {
    id: "58",
    name: "Language studies",
    category: "English and Literature",
  },
  {
    id: "59",
    name: "Literature",
    category: "English and Literature",
  },
  {
    id: "60",
    name: "Shakespeare literature",
    category: "English and Literature",
  },

  // Health and life sciences caterogy
  {
    id: "61",
    name: "Anatomy",
    category: "Health and life sciences",
  },
  {
    id: "62",
    name: "Biology",
    category: "Health and life sciences",
  },
  {
    id: "63",
    name: "Dentistry",
    category: "Health and life sciences",
  },
  {
    id: "64",
    name: "Food and culinary studies",
    category: "Health and life sciences",
  },
  {
    id: "65",
    name: "Healthcare",
    category: "Health and life sciences",
  },
  {
    id: "66",
    name: "Medicine and health",
    category: "Health and life sciences",
  },
  {
    id: "67",
    name: "Nursing",
    category: "Health and life sciences",
  },
  {
    id: "68",
    name: "Nutrition",
    category: "Health and life sciences",
  },
  {
    id: "69",
    name: "Pharmacology",
    category: "Health and life sciences",
  },
  {
    id: "70",
    name: "Physical education",
    category: "Health and life sciences",
  },
  {
    id: "71",
    name: "Psychiatry",
    category: "Health and life sciences",
  },
  {
    id: "72",
    name: "Sports and athletics",
    category: "Health and life sciences",
  },
  {
    id: "73",
    name: "Veterinary science",
    category: "Health and life sciences",
  },

  // History category
  {
    id: "74",
    name: "Amarican history",
    category: "History",
  },
  {
    id: "75",
    name: "Anthropology",
    category: "History",
  },
  {
    id: "76",
    name: "History",
    category: "History",
  },

  // Humanities category
  {
    id: "77",
    name: "Canadian studies",
    category: "Humanities",
  },
  {
    id: "78",
    name: "Gender studies",
    category: "Humanities",
  },
  {
    id: "79",
    name: "Globalization",
    category: "Humanities",
  },
  {
    id: "80",
    name: "Information Ethics",
    category: "Humanities",
  },
  {
    id: "81",
    name: "Journalism",
    category: "Humanities",
  },
  {
    id: "82",
    name: "Linguistics",
    category: "Humanities",
  },
  {
    id: "83",
    name: "Mythology",
    category: "Humanities",
  },
  {
    id: "84",
    name: "Tourism",
    category: "Humanities",
  },

  // Legal category
  {
    id: "85",
    name: "Criminal justice",
    category: "Legal",
  },
  {
    id: "86",
    name: "Criminology",
    category: "Legal",
  },
  {
    id: "87",
    name: "Forensic science",
    category: "Legal",
  },
  {
    id: "88",
    name: "Law",
    category: "Legal",
  },
  {
    id: "89",
    name: "Public administration",
    category: "Legal",
  },

  // Marketing category
  {
    id: "90",
    name: "Advertising",
    category: "Marketing",
  },
  {
    id: "91",
    name: "Digital marketing",
    category: "Marketing",
  },
  {
    id: "92",
    name: "Marketing",
    category: "Marketing",
  },
  {
    id: "93",
    name: "Public relations",
    category: "Marketing",
  },

  // Mathematics and statistics category
  {
    id: "94",
    name: "Algebra",
    category: "Mathematics and statistics",
  },
  {
    id: "95",
    name: "Analytics",
    category: "Mathematics and statistics",
  },
  {
    id: "96",
    name: "Calculus",
    category: "Mathematics and statistics",
  },
  {
    id: "97",
    name: "Data science",
    category: "Mathematics and statistics",
  },
  {
    id: "98",
    name: "Excel",
    category: "Mathematics and statistics",
  },
  {
    id: "99",
    name: "Geometry",
    category: "Mathematics and statistics",
  },
  {
    id: "100",
    name: "Geometry",
    category: "Mathematics and statistics",
  },
  {
    id: "101",
    name: "Mathematics",
    category: "Mathematics and statistics",
  },
  {
    id: "102",
    name: "Statistics",
    category: "Mathematics and statistics",
  },
  {
    id: "103",
    name: "Trigonometry",
    category: "Mathematics and statistics",
  },

  // Natural sciences category
  {
    id: "104",
    name: "Animal science",
    category: "Natural sciences",
  },
  {
    id: "105",
    name: "Astronomy",
    category: "Natural sciences",
  },
  {
    id: "106",
    name: "Atmospheric science",
    category: "Natural sciences",
  },
  {
    id: "107",
    name: "Chemistry",
    category: "Natural sciences",
  },
  {
    id: "108",
    name: "Environmental science",
    category: "Natural sciences",
  },
  {
    id: "109",
    name: "Geography",
    category: "Natural sciences",
  },
  {
    id: "110",
    name: "Geology",
    category: "Natural sciences",
  },
  {
    id: "111",
    name: "Natural science",
    category: "Natural sciences",
  },
  {
    id: "112",
    name: "Physics",
    category: "Natural sciences",
  },

  // Philosophy category
  {
    id: "113",
    name: "Ethics",
    category: "Philosophy",
  },
  {
    id: "114",
    name: "Philosophy",
    category: "Philosophy",
  },
  {
    id: "115",
    name: "Religion and theology",
    category: "Philosophy",
  },

  // Political sciences category
  {
    id: "116",
    name: "Emergency management",
    category: "Political sciences",
  },
  {
    id: "117",
    name: "Global issues & disaster and crisis management",
    category: "Political sciences",
  },
  {
    id: "118",
    name: "Global studies",
    category: "Political sciences",
  },
  {
    id: "119",
    name: "Immigration and citizenship",
    category: "Political sciences",
  },
  {
    id: "120",
    name: "International affairs / relations",
    category: "Political sciences",
  },
  {
    id: "121",
    name: "Military science",
    category: "Political sciences",
  },
  {
    id: "122",
    name: "Political science",
    category: "Political sciences",
  },
  {
    id: "123",
    name: "",
    category: "Political sciences",
  },

  // Social sciences category
  {
    id: "124",
    name: "Behavioral science and human development",
    category: "Social sciences",
  },
  {
    id: "125",
    name: "Career and professional development",
    category: "Social sciences",
  },
  {
    id: "126",
    name: "Communication and media",
    category: "Social sciences",
  },
  {
    id: "127",
    name: "Community and society",
    category: "Social sciences",
  },
  {
    id: "128",
    name: "Cultural studies",
    category: "Social sciences",
  },
  {
    id: "129",
    name: "Family and child studies",
    category: "Social sciences",
  },
  {
    id: "130",
    name: "Feminism",
    category: "Social sciences",
  },
  {
    id: "131",
    name: "Human relations",
    category: "Social sciences",
  },
  {
    id: "132",
    name: "Psychology",
    category: "Social sciences",
  },
  {
    id: "133",
    name: "Social science",
    category: "Social sciences",
  },
  {
    id: "134",
    name: "Social work",
    category: "Social sciences",
  },
  {
    id: "135",
    name: "Sociology",
    category: "Social sciences",
  },
  {
    id: "136",
    name: "Student activities",
    category: "Social sciences",
  },
];

const popularButtons: PopularButtons[] = [
  { id: 1, name: "Nursing" },
  { id: 2, name: "Business and management" },
  { id: 3, name: "History" },
  { id: 4, name: "English" },
  { id: 5, name: "Marketing" },
  { id: 6, name: "Healthcare" },
  { id: 7, name: "Psychology" },
  { id: 8, name: "Entrepreneurship" },
  { id: 9, name: "Information Technology" },
  { id: 10, name: "Accounting" },
  { id: 11, name: "Finannce" },
  { id: 12, name: "Mathematics" },
  { id: 13, name: "Economics" },
];

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(value);

  // Filter options based on search term
  const filteredOptions = SubjectOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group options by category
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, SubjectOption[]>);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setDisplayValue(value); // Reset display value to selected value
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // Handle option selection
  const handleOptionSelect = (optionName: string) => {
    onChange(optionName);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setDisplayValue(newValue);
    setIsOpen(true);
  };

  // Update display value when value prop changes
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <div className="p-4">
      <div className="vertical-space-between mb-2">
        <p className="mb-3 text-xl text-gray-600">Subject</p>
        <p
          className={`text-sm transition-all duration-1000 ${
            isOpen ? "text-gray-400" : "text-white"
          }`}
        >
          Select or search your subject
        </p>
      </div>
      <div ref={containerRef} className="w-fit relative">
        <div
          onClick={() => setIsOpen(true)}
          className={`w-[324px] p-3 rounded-md border transition-all duration-500 ${
            isOpen
              ? "horizontal-start gap-3 bg-gray-50 border-blue-500"
              : "horizontal-space-between bg-gray-100 border-transparent cursor-pointer"
          }`}
        >
          <IoSearch
            size={23}
            className={`text-gray-400 ${isOpen ? "block" : "hidden"}`}
          />
          <input
            type="text"
            value={isOpen ? searchTerm : displayValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={value || "Select your subject"}
            className="outline-none bg-transparent w-[80%]"
          />
          <FaChevronDown
            size={20}
            className={`text-gray-400 ${isOpen ? "hidden" : "block"}`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-[65] order-form-drop-down-cont">
            <div className="order-form-drop-down">
              {Object.entries(groupedOptions).map(([category, options]) => (
                <div key={category}>
                  <div className="category-name">{category}</div>
                  {options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleOptionSelect(option.name)}
                      className={`py-2 px-2 m-1 cursor-pointer rounded-md text-gray-600 truncate transition-all duration-500 ${
                        value === option.name
                          ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
              ))}
              {Object.keys(groupedOptions).length === 0 && (
                <div className="px-3 py-2 text-gray-500">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Pupular Buttons */}
      <div className="mt-8">
        <p className="text-gray-500 text-sm">Popular:</p>
        <div className="container">
          <div className="flex flex-wrap">
            {popularButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleOptionSelect(button.name)}
                className={`py-2 px-3 m-3 w-fit rounded-lg text-sm transition-all duration-500 ${
                  value === button.name
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                    : "bg-gray-200 text-gray-600 hover:text-blue-500"
                }`}
              >
                {button.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
