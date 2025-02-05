type Props = {
  data: unknown[] | undefined;
  label: string;
};

const EmptyData = ({ data, label }: Props) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-6">No {label} found</p>;
  }
  return null;
};

export default EmptyData;
