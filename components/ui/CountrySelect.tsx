import React from "react";

// List of countries with ISO 3166-1 alpha-2 codes
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
  { code: "RU", name: "Russia" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "MX", name: "Mexico" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  // ...add more as needed
];

export interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  name = "country",
  required = true,
  className = "",
}) => (
  <select
    name={name}
    value={value}
    onChange={e => onChange(e.target.value)}
    required={required}
    className={className}
  >
    <option value="">Select country</option>
    {COUNTRIES.map(c => (
      <option key={c.code} value={c.code}>
        {c.name}
      </option>
    ))}
  </select>
);
