import React from 'react';

// קומפוננטה לתצוגת שורת פריט בהזמנה
export function OrderItemRow({ item }) {
  return (
    <tr>
      <td className="py-2 px-4 whitespace-nowrap">{item.name}</td>
      <td className="py-2 px-4">
        {(item.customOptions || item.customDetails || item.custom || item.name.includes('מותאמ') || item.name.includes('אישי')) && (
          <div className="bg-primary/5 p-3 rounded-md border border-primary/20">
            <h4 className="font-medium text-primary mb-2">פרטי עיצוב מותאם אישית:</h4>
            
            {item.customDetails && (
              <ul className="list-disc mr-4 space-y-2">
                {item.customDetails.baseType && (
                  <li>
                    <span className="font-medium">סוג בסיס: </span>
                    {item.customDetails.baseType === 'necklace' ? 'שרשרת' : 
                     item.customDetails.baseType === 'bracelet' ? 'צמיד' : 
                     item.customDetails.baseType}
                  </li>
                )}
                {item.customDetails.modelName && (
                  <li>
                    <span className="font-medium">דגם: </span>
                    {item.customDetails.modelName}
                  </li>
                )}
                {item.customDetails.type && (
                  <li>
                    <span className="font-medium">סוג תכשיט: </span>
                    {typeof item.customDetails.type === 'string' 
                      ? item.customDetails.type 
                      : item.customDetails.type.name || 'לא צוין'}
                  </li>
                )}
                {item.customDetails.material && (
                  <li>
                    <span className="font-medium">חומר: </span>
                    {typeof item.customDetails.material === 'string' 
                      ? item.customDetails.material
                      : item.customDetails.material.name || 'לא צוין'}
                  </li>
                )}
                {item.customDetails.length && (
                  <li>
                    <span className="font-medium">אורך: </span>
                    {typeof item.customDetails.length === 'string'
                      ? item.customDetails.length
                      : `${item.customDetails.length.lengthValue || ''}${item.customDetails.length.unit ? ` ${item.customDetails.length.unit}` : ''}`}
                  </li>
                )}
                {item.customDetails.width && (
                  <li>
                    <span className="font-medium">רוחב: </span>
                    {typeof item.customDetails.width === 'string'
                      ? item.customDetails.width
                      : `${item.customDetails.width.widthValue || ''}${item.customDetails.width.unit ? ` ${item.customDetails.width.unit}` : ''}`}
                  </li>
                )}
                {item.customDetails.color && (
                  <li>
                    <span className="font-medium">צבע: </span>
                    {typeof item.customDetails.color === 'string' 
                      ? item.customDetails.color 
                      : item.customDetails.color.name || item.customDetails.color.value || 'לא צוין'}
                    {item.customDetails.color && (item.customDetails.color.hex || (typeof item.customDetails.color === 'string' && item.customDetails.color.startsWith('#'))) && (
                      <span 
                        className="inline-block w-4 h-4 rounded-full ml-2 border border-gray-300" 
                        style={{ backgroundColor: typeof item.customDetails.color === 'string' 
                          ? item.customDetails.color 
                          : item.customDetails.color.hex }}
                      ></span>
                    )}
                  </li>
                )}
                {item.customDetails.style && (
                  <li>
                    <span className="font-medium">סגנון: </span>
                    {typeof item.customDetails.style === 'string' 
                      ? item.customDetails.style
                      : item.customDetails.style.name || 'לא צוין'}
                  </li>
                )}
                {item.customDetails.pattern && (
                  <li>
                    <span className="font-medium">דוגמה: </span>
                    {typeof item.customDetails.pattern === 'string'
                      ? item.customDetails.pattern
                      : item.customDetails.pattern.name || 'לא צוין'}
                  </li>
                )}
                {item.customDetails.clasp && (
                  <li>
                    <span className="font-medium">סוג סוגר: </span>
                    {typeof item.customDetails.clasp === 'string'
                      ? item.customDetails.clasp
                      : item.customDetails.clasp.name || 'לא צוין'}
                  </li>
                )}
                {item.customDetails.selectedCharms && item.customDetails.selectedCharms.length > 0 && (
                  <li>
                    <span className="font-medium">תליונים נבחרים ({item.customDetails.selectedCharms.length}): </span>
                    <div className="mt-2 bg-white p-2 rounded border">
                      <ul className="list-disc mr-6 space-y-1">
                        {item.customDetails.selectedCharms.map((charm, j) => (
                          <li key={j} className="flex items-center">
                            {charm.image && (
                              <span className="inline-block w-6 h-6 rounded-full bg-white border border-gray-200 ml-2 overflow-hidden">
                                <img 
                                  src={charm.image} 
                                  alt={charm.name} 
                                  className="w-full h-full object-cover"
                                />
                              </span>
                            )}
                            {charm.name || 'תליון ללא שם'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )}
                {item.customDetails.gemstones && item.customDetails.gemstones.length > 0 && (
                  <li>
                    <span className="font-medium">אבני חן ({item.customDetails.gemstones.length}): </span>
                    <div className="mt-2 bg-white p-2 rounded border">
                      <ul className="list-disc mr-6 space-y-1">
                        {item.customDetails.gemstones.map((gemstone, j) => (
                          <li key={j} className="flex items-center">
                            {gemstone.color && (
                              <span 
                                className="inline-block w-4 h-4 rounded-full ml-2 border border-gray-300" 
                                style={{ backgroundColor: typeof gemstone.color === 'string' 
                                  ? gemstone.color 
                                  : gemstone.color.hex || '#CCCCCC' }}
                              ></span>
                            )}
                            {gemstone.name || 'אבן חן ללא שם'}
                            {gemstone.size && <span className="text-xs text-gray-600 mr-1">({gemstone.size})</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )}
                {item.customDetails.size && (
                  <li>
                    <span className="font-medium">מידה: </span>
                    {item.customDetails.size}
                  </li>
                )}
                {item.customDetails.text && (
                  <li>
                    <span className="font-medium">טקסט מותאם אישית: </span>
                    <div className="mt-1 bg-white p-2 rounded border">"{item.customDetails.text}"</div>
                  </li>
                )}
                {item.customDetails.font && (
                  <li>
                    <span className="font-medium">פונט: </span>
                    {typeof item.customDetails.font === 'string'
                      ? item.customDetails.font
                      : item.customDetails.font.name || 'לא צוין'}
                  </li>
                )}
                {item.customDetails.notes && (
                  <li>
                    <span className="font-medium">הערות מיוחדות: </span>
                    <div className="mt-1 p-2 bg-white rounded border">
                      {item.customDetails.notes}
                    </div>
                  </li>
                )}
              </ul>
            )}
            
            {(!item.customDetails && (item.name.includes('מותאמ') || item.name.includes('אישי'))) && (
              <div className="mt-2">
                <p className="text-sm text-gray-700">מידע נוסף לא זמין. אנא בדוק את הערות ההזמנה.</p>
              </div>
            )}
            
            {item.customization && (
              <div className="mt-2">
                <h5 className="font-medium mb-1">פרטי התאמה נוספים:</h5>
                <div className="bg-white p-3 rounded border">
                  <ul className="list-none space-y-2">
                    {Object.entries(item.customization).map(([key, value]) => {
                      // מיפוי שמות שדות לעברית
                      const hebrewKeyMap = {
                        braceletType: "סוג צמיד",
                        necklaceType: "סוג שרשרת",
                        braceletPrice: "מחיר בסיס",
                        necklacePrice: "מחיר בסיס",
                        price: "מחיר",
                        basePrice: "מחיר בסיס",
                        selectedCharms: "תליונים נבחרים",
                        selectedGemstones: "אבני חן נבחרות",
                        material: "חומר",
                        color: "צבע",
                        size: "מידה",
                        length: "אורך",
                        width: "רוחב",
                        text: "טקסט",
                        font: "פונט",
                        notes: "הערות"
                      };
                      
                      const hebrewKey = hebrewKeyMap[key] || key;
                      
                      // טיפול בערכים מיוחדים
                      if (key === "selectedCharms" && Array.isArray(value) && value.length > 0) {
                        return (
                          <li key={key}>
                            <span className="font-medium">{hebrewKey} ({value.length}): </span>
                            <div className="mt-1 pr-4">
                              <ul className="list-disc space-y-1">
                                {value.map((charm, idx) => (
                                  <li key={idx} className="flex items-center">
                                    {charm.image && (
                                      <span className="inline-block w-6 h-6 rounded-full bg-white border border-gray-200 ml-2 overflow-hidden">
                                        <img 
                                          src={charm.image} 
                                          alt={charm.name} 
                                          className="w-full h-full object-cover"
                                        />
                                      </span>
                                    )}
                                    {charm.name} {charm.price && <span className="text-gray-600 mr-1">₪{charm.price}</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        );
                      }
                      
                      if (key === "notes" && (!value || value.trim() === "")) {
                        return null; // אין צורך להציג הערות ריקות
                      }
                      
                      // הצגת ערכים רגילים
                      return (
                        <li key={key}>
                          <span className="font-medium">{hebrewKey}: </span>
                          {typeof value === 'number' && key.toLowerCase().includes('price') 
                            ? `₪${value}`
                            : (typeof value === 'string' 
                              ? (value.trim() || '-')
                              : (typeof value === 'object' && value !== null
                                ? JSON.stringify(value)
                                : String(value) || '-')
                              )
                          }
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </td>
      <td className="py-2 px-4 whitespace-nowrap">₪{item.price}</td>
      <td className="py-2 px-4 whitespace-nowrap">{item.quantity}</td>
      <td className="py-2 px-4 whitespace-nowrap">₪{item.price * item.quantity}</td>
    </tr>
  );
} 