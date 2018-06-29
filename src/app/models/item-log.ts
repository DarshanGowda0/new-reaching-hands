export interface ItemAbstract {
    logId: string;
    date: any;
    quantity: number;
    cost: number;
    category: string;
    subCategory: string;
    itemId: string;
    addedBy: string;
    logType: string;
}

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
export interface ItemLog1 {

    logId: string;
    serviceDate: string;
    servicer: string;
    logType: string; // donation etc
    selectedCommons: string;
    billNumber: string;
    cost: number;
    remarks: string;
    date: any;
    category: string;
    subCategory: string;
    itemId: string;
    addedBy: string;
}
export interface ItemLog2 {
    logId: string;
    date: any;
    startDate: string;
    endDate: string;
    selectedCommons: string;
    studentName: string;
    cost: number;
    remarks: string;
    logType: string; // isAdded, isRemoved or isDonated
    category: string;
    subCategory: string;
    itemId: string;
    addedBy: string;
}
export interface ItemLog3 {
    logId: string;
    serviceDate: any;
    servicer: string;
    logType: string; // donation etc
    selectedCommons: string;
    billNumber: string;
    cost: number;
    remarks: string;
    date: any;
    category: string;
    subCategory: string;
    itemId: string;
    addedBy: string;
}
export interface ItemLogP {

    logId: string;
    serviceDate: string;
    servicer: string;
    logType: string; // donation etc
    selectedCommons: string;
    billNumber: string;
    cost: number;
    remarks: string;
    date: any;
    category: string;
    subCategory: string;
    itemId: string;
    addedBy: string;
}
