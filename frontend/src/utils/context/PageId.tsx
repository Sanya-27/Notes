import React, { createContext, useContext, useState, ReactNode } from "react";

interface PageIdContextProps {
    pageId: number;
    setPageId: React.Dispatch<React.SetStateAction<number>>;
}

const PageIdContext = createContext<PageIdContextProps | undefined>(undefined);

export const PageIdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pageId, setPageId] = useState<number>(0); 

    return (
        <PageIdContext.Provider value={{ pageId, setPageId }}>
            {children}
        </PageIdContext.Provider>
    );
};

export const usePageId = () => {
    const context = useContext(PageIdContext);
    if (context === undefined) {
        throw new Error('usePageId must be used within a PageIdProvider');
    }
    return context;
};

export default PageIdContext;