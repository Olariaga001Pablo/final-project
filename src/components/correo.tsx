import React, { useState } from "react";
import TabTwoContent from "./buzon";
import TabOneContent from "./enviar";

const TabsComponent = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    const handleTabClick = (tab = "tab1") => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className="flex space-x-4 mb-4">
                <button 
                    onClick={() => handleTabClick("tab1")} 
                    className={`px-4 py-2 rounded-md focus:outline-none ${activeTab === "tab1" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                    Enviar Mensaje
                </button>
                <button 
                    onClick={() => handleTabClick("tab2")} 
                    className={`px-4 py-2 rounded-md focus:outline-none ${activeTab === "tab2" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                    Mensajes Recibidos
                </button>
            </div>
            <div>
                {activeTab === "tab1" && <TabOneContent />}
                {activeTab === "tab2" && <TabTwoContent activeTab={activeTab} />}
            </div>
        </div>
    );
};

export default TabsComponent;
