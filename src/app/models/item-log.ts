export interface ItemLog {
    logId: string;
    date: any;
    quantity: number;
    selectedCommons: string;
    cost: number;
    remarks: string;
    logType: string; // isAdded, isRemoved or isDonated
    category: string;
    subCategory: string;
    itemId: string;
    addedBy: string;
}
