import React, { useEffect, useState } from "react";

/**
 * Number of Elements Demo
 *  - .itemsBox children increase over time
 *  - used to test numberOfElementsToBe, numberOfElementsToBeLessThan, numberOfElementsToBeMoreThan
 */	

export default function NumberOfElementsBatchDemo() {
  const [items, setItems] = useState(["Item 1"]);

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setItems(prev => [...prev, "Item 2"]), 1200));
    timers.push(setTimeout(() => setItems(prev => [...prev, "Item 3"]), 1800));
    timers.push(setTimeout(() => setItems(prev => [...prev, "Item 4"]), 2400));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — Number of Elements</h1>
        <p className="text-sm opacity-90">Demo for numberOfElementsToBe, numberOfElementsToBeLessThan, numberOfElementsToBeMoreThan</p>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <section>
          <h2 className="font-bold">Dynamic Items (class="dyn-item")</h2>
          <div id="itemsBox" className="space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="dyn-item p-2 bg-green-100 border rounded">
                {it}
              </div>
            ))}
          </div>
          <p className="text-xs font-mono mt-2">Count = {items.length}</p>
        </section>
      </main>
    </div>
  );
}
