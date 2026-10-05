// Stands in for a table's rows while they load, when they fail, or when there
// are none.
const TableStatusRow = ({
  colSpan,
  isLoading = false,
  errorMessage,
  emptyMessage,
}: {
  colSpan: number;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyMessage: string;
}) => (
  <tr>
    <td colSpan={colSpan} className="py-12 text-center text-sm">
      {isLoading ? (
        <span className="mx-auto block h-4 w-48 animate-pulse rounded bg-gray-100" />
      ) : errorMessage ? (
        <span className="text-red-600">{errorMessage}</span>
      ) : (
        <span className="text-gray-400">{emptyMessage}</span>
      )}
    </td>
  </tr>
);

export default TableStatusRow;
