type Props = {
  message: string;
};

export function Toast({ message }: Props) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 shadow-lg">
      {message}
    </div>
  );
}
