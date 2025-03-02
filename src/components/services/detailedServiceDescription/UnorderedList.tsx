interface UnorderedListProps {
  children: React.ReactNode;
}

const UnorderedList = ({ children }: UnorderedListProps) => {
  return (
    <ul className="text-sm list-disc space-y-2 pl-4 mb-6 ml-2">{children}</ul>
  );
};

export default UnorderedList;
