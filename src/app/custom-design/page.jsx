"use client"

import CustomDesignTool from '../../components/CustomDesignTool'

export default function CustomDesignPage() {
  return (
    <div className="container-custom py-8">
      <h1 className="text-center mb-8">עצבי תכשיט משלך</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-center mb-8">
          בחרי את החומרים, התליונים והעיצוב שאת אוהבת ליצירת תכשיט ייחודי במיוחד בשבילך
        </p>
        
        <CustomDesignTool />
      </div>
    </div>
  )
} 