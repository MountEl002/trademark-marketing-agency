import { TableRow } from "@/types/servicesPages";

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
