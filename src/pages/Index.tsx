
import React from 'react';
import BillSplitter from '../components/BillSplitter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Slice It Easy
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Split bills effortlessly with friends and family
        </p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <BillSplitter />
      </main>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Slice It Easy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
