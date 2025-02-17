import React, { ReactNode } from "react";

// Define the structure for each table row
interface TableRow {
  icon: ReactNode;
  primaryText: string;
  secondaryText: string;
}

// Component props
interface ServiceDescriptionTableProps {
  tableData: TableRow[];
}

const ServiceDescriptionTable = ({
  tableData,
}: ServiceDescriptionTableProps) => {
  return (
    <table className="border-collapse border table-fixed border-gray-400 text-sm">
      <tbody>
        {tableData.map((feature, index) => (
          <tr key={index}>
            <td>
              <span className="mr-2">{feature.icon}</span>
              {feature.primaryText}
            </td>
            <td>{feature.secondaryText}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServiceDescriptionTable;
