interface OrderedListProps {
  children: React.ReactNode;
}

const OrderedList = ({ children }: OrderedListProps) => {
  return (
    <ol className="text-sm list-decimal space-y-2 pl-4 mb-6">{children}</ol>
  );
};

export default OrderedList;
