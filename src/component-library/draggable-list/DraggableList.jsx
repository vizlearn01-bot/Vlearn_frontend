import { Bars2Icon } from "@heroicons/react/24/outline";
import React from "react";

const DraggableList = ({
    onChange = () => {},
    listItems = [
        { id: "item-1", label: "Item 1", position: 0 },
        { id: "item-2", label: "Item 2", position: 1 },
        { id: "item-3", label: "Item 3", position: 2 },
        { id: "item-4", label: "Item 4", position: 3 },
    ],
}) => {
    const [items, setItems] = React.useState(listItems || []);

    const [draggedItem, setDraggedItem] = React.useState(null);
    const [touchedItem, setTouchedItem] = React.useState(null);
    const [dropTarget, setDropTarget] = React.useState(null);
    const touchIndexRef = React.useRef(null);

    const handleDragStart = (e, position) => {
        setDraggedItem(position);
        e.currentTarget.style.opacity = "0.4";
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = "1";
        setDraggedItem(null);
        setDropTarget(null);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();

        // Special handling for first and last items
        if (index === 0 || index === items.length - 1) {
            const rect = e.currentTarget.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;

            if (index === 0 && e.clientY < midpoint) {
                setDropTarget(0);
            } else if (index === items.length - 1 && e.clientY > midpoint) {
                setDropTarget(items.length);
            } else {
                setDropTarget(index);
            }
        } else {
            // Original behavior for middle items
            setDropTarget(index);
        }
    };

    const handleDrop = (e, dropPosition) => {
        e.preventDefault();
        if (dropTarget !== null) {
            reorderItems(dropTarget);
        }
        setDropTarget(null);
    };

    const handleTouchStart = (e, index) => {
        e.preventDefault();
        touchIndexRef.current = index;
        setTouchedItem(index);
        e.currentTarget.style.opacity = "0.4";
        e.currentTarget.style.backgroundColor = "#f3f4f6";
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (touchedItem === null) return;

        const touch = e.touches[0];
        const elements = document.elementsFromPoint(
            touch.clientX,
            touch.clientY
        );
        const droppableElement = elements.find(
            (el) => el.getAttribute("data-index") !== null
        );

        if (droppableElement) {
            const index = parseInt(droppableElement.getAttribute("data-index"));

            // Special handling for first and last items
            if (index === 0 || index === items.length - 1) {
                const rect = droppableElement.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                if (index === 0 && touch.clientY < midpoint) {
                    touchIndexRef.current = 0;
                    setDropTarget(0);
                } else if (
                    index === items.length - 1 &&
                    touch.clientY > midpoint
                ) {
                    touchIndexRef.current = items.length;
                    setDropTarget(items.length);
                } else {
                    touchIndexRef.current = index;
                    setDropTarget(index);
                }
            } else {
                // Original behavior for middle items
                touchIndexRef.current = index;
                setDropTarget(index);
            }
        }
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        if (touchedItem !== null && touchIndexRef.current !== null) {
            reorderItems(touchIndexRef.current);
            const elements = document.querySelectorAll("[data-index]");
            elements.forEach((el) => {
                el.style.opacity = "1";
                el.style.backgroundColor = "";
            });
        }
        setTouchedItem(null);
        setDropTarget(null);
        touchIndexRef.current = null;
    };

    const reorderItems = (dropPosition) => {
        const startIndex = touchedItem !== null ? touchedItem : draggedItem;
        if (startIndex === dropPosition) return;

        const newItems = [...items];
        const draggedItemContent = newItems[startIndex];

        newItems.splice(startIndex, 1);
        newItems.splice(dropPosition, 0, draggedItemContent);

        newItems.forEach((item, index) => {
            item.position = index + 1;
        });

        setItems(newItems);
        onChange(newItems);
    };

    const renderDropIndicator = (index) => {
        const isDropTarget = dropTarget === index;
        const isDragging = draggedItem !== null || touchedItem !== null;
        const showIndicator = isDropTarget && isDragging;

        return (
            <div
                className={`h-1 -mt-1 mb-1 rounded transition-all duration-200 ${
                    showIndicator ? "bg-blue-500 h-2" : "bg-transparent"
                }`}
            />
        );
    };

    return (
        <div className="w-full space-y-2">
            {renderDropIndicator(0)}
            {items.map((item, index) => (
                <div key={item.id}>
                    <div
                        data-index={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onTouchStart={(e) => handleTouchStart(e, index)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="mb-2 p-4 bg-white border rounded-xs shadow-2xs cursor-move hover:bg-gray-50 transition-colors touch-none select-none"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium">{item.label}</span>
                            <div className="text-gray-500 text-sm flex">
                                <Bars2Icon className="w-5 h-5 ml-2" />
                            </div>
                        </div>
                    </div>
                    {renderDropIndicator(index + 1)}
                </div>
            ))}
        </div>
    );
};
export default DraggableList;
