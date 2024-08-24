import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContentContextProps {
    content: string | null;
    setContent: React.Dispatch<React.SetStateAction<string | null>>;
}

const ContentContext = createContext<ContentContextProps | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<string | null>(null);

    return (
        <ContentContext.Provider value={{ content, setContent }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};

export default ContentContext;
