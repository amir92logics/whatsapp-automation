import { MessageSquare } from "lucide-react";

interface FeeWhatsAppPreviewCardProps {
    studentName: string;
    month: string;
    amount: string;
    paymentLink: string;
    schoolName: string;
}

export function FeeWhatsAppPreviewCard({
    studentName,
    month,
    amount,
    paymentLink,
    schoolName
}: FeeWhatsAppPreviewCardProps) {
    return (
        <div className="max-w-sm mx-auto bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 font-sans">
            {/* WhatsApp Bubble Container */}
            <div className="bg-white rounded-tr-xl rounded-bl-xl rounded-br-xl rounded-tl-none shadow-sm border border-gray-100 overflow-hidden relative ml-2">
                {/* Tiny Triangle for Bubble Effect */}
                <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent transform rotate-0" />

                {/* Header */}
                <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-bold text-emerald-950">{schoolName}</h3>
                        <p className="text-[10px] text-emerald-600/70 font-medium">Powered by AM Automation Studio</p>
                    </div>
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">
                        Tuition Fees for {month}
                    </h4>

                    <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                            <span>Child Name:</span>
                            <span className="font-semibold text-gray-900">{studentName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Monthly Tuition:</span>
                            <span className="font-semibold text-gray-900">Rs. {amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Activity Fee:</span>
                            <span className="font-semibold text-gray-900">Rs. 0</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-emerald-50 p-2 rounded-lg border border-emerald-100 mt-2">
                        <span className="text-xs font-bold text-emerald-800">Total Due:</span>
                        <span className="text-sm font-black text-emerald-950">Rs. {amount}</span>
                    </div>

                    <div className="pt-2">
                        <p className="text-[10px] text-gray-500 mb-1">Click here to pay securely:</p>
                        <a href="#" className="text-xs text-blue-500 underline break-all font-medium hover:text-blue-600">
                            {paymentLink}
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 text-[10px] text-gray-400 italic">
                    Thank you! – {schoolName}
                </div>
            </div>

            <div className="text-[9px] text-gray-400 text-right mt-1 mr-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    );
}
