import TransactionList from "@/components/customer/TransactionList";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      <TransactionList />
    </div>
  );
}
