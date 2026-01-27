import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Link,
    Img,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

export default function PaymentReceiptEmail({
    userName = "Student Name",
    mentorName = "Mentor Name",
    sessionType = "Mentorship Session",
    amount = "₹500.00",
    date = "January 27, 2026",
    paymentId = "pay_123456789",
    invoiceId = "INV-260001",
    formattedPaymentMethod = "Card",
    paymentMethodDetails = { Last4: "xxxx 1234", Network: "Visa" },
    paymentFee = "0.00",
    paymentTax = "0.00",
}) {
    const formattedDate = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Html>
            <Head />
            <Preview>Invoice {invoiceId} from Campus Connect</Preview>
            <Tailwind>
                <Body className="bg-white font-sans text-slate-900">
                    <Container className="mx-auto py-10 px-0 max-w-[600px]">

                        {/* Header with Logo */}
                        <div className="p-8 bg-white border-b border-slate-200">
                            <Row>
                                <Column>
                                    <div className="flex items-center">
                                        <Img
                                            src="https://campus-connect.co.in/icon.png"
                                            width="40"
                                            height="40"
                                            alt="Logo"
                                            className="inline-block align-middle"
                                        />
                                        <span className="text-lg font-bold ml-2.5 align-middle text-slate-900">
                                            Campus Connect
                                        </span>
                                    </div>
                                    <Text className="text-sm text-slate-500 m-0 mt-1">Learner's Platform</Text>
                                </Column>
                                <Column className="text-right">
                                    <Text className="text-2xl font-bold text-slate-900 m-0 tracking-tight">INVOICE</Text>
                                    <Text className="text-sm text-slate-500 m-0 mt-1 font-mono">{invoiceId}</Text>
                                </Column>
                            </Row>
                        </div>

                        {/* Invoice Info Grid */}
                        <div className="p-8 bg-slate-50 border-b border-slate-200">
                            <Row>
                                {/* BILLED TO SECTION */}
                                <Column className="w-1/2 align-top">
                                    <Text className="text-[11px] font-bold text-slate-500 uppercase mb-1 tracking-wide">BILLED TO</Text>
                                    <Text className="text-base font-bold text-slate-900 m-0">{userName}</Text>

                                    <div className="mt-4">
                                        <Text className="text-[11px] font-bold text-slate-500 uppercase mb-1 tracking-wide">PAYMENT METHOD</Text>
                                        <Text className="text-sm font-medium text-slate-700 m-0">{formattedPaymentMethod}</Text>
                                        {/* Dynamic Details based on method */}
                                        {Object.entries(paymentMethodDetails).map(([key, val]) => (
                                            <Text key={key} className="text-xs text-slate-500 m-0">
                                                {key}: {val}
                                            </Text>
                                        ))}
                                    </div>
                                </Column>

                                {/* INVOICE META SECTION */}
                                <Column className="w-1/2 text-right align-top">
                                    <div className="mb-4">
                                        <Text className="text-[11px] font-bold text-slate-500 uppercase mb-1 tracking-wide">ISSUED DATE</Text>
                                        <Text className="text-sm font-medium text-slate-900 m-0">{formattedDate}</Text>
                                    </div>
                                    <div>
                                        <Text className="text-[11px] font-bold text-slate-500 uppercase mb-1 tracking-wide">TRANSACTION ID</Text>
                                        <Text className="text-sm font-medium text-slate-900 m-0 font-mono">#{paymentId}</Text>
                                    </div>
                                </Column>
                            </Row>
                        </div>

                        {/* Invoice Items Table */}
                        <div className="p-8 bg-white">
                            <Section>
                                <Row className="border-b border-slate-200 pb-2">
                                    <Column className="w-[70%] text-left">
                                        <Text className="text-[11px] font-bold text-slate-500 uppercase m-0">DESCRIPTION</Text>
                                    </Column>
                                    <Column className="w-[30%] text-right">
                                        <Text className="text-[11px] font-bold text-slate-500 uppercase m-0 text-right">AMOUNT</Text>
                                    </Column>
                                </Row>

                                <Row className="border-b border-slate-100 py-4">
                                    <Column className="w-[70%]">
                                        <Text className="text-sm font-bold text-slate-900 m-0">
                                            {sessionType}
                                        </Text>
                                        <Text className="text-xs text-slate-500 m-0 mt-1">
                                            Mentor: {mentorName}
                                        </Text>
                                        <Text className="text-xs text-slate-500 m-0">
                                            Date: {date}
                                        </Text>
                                    </Column>
                                    <Column className="w-[30%] text-right align-top">
                                        <Text className="text-sm font-medium text-slate-900 m-0">{amount}</Text>
                                    </Column>
                                </Row>

                                {/* Fees & Taxes (if any) */}
                                {(parseFloat(paymentFee) > 0 || parseFloat(paymentTax) > 0) && (
                                    <>
                                        <Row className="pt-3">
                                            <Column className="text-right"><Text className="text-xs font-medium text-slate-500 m-0">Processing Fee</Text></Column>
                                            <Column className="text-right w-[30%]"><Text className="text-xs font-medium text-slate-700 m-0">₹{paymentFee}</Text></Column>
                                        </Row>
                                        <Row>
                                            <Column className="text-right"><Text className="text-xs font-medium text-slate-500 m-0">Tax</Text></Column>
                                            <Column className="text-right w-[30%]"><Text className="text-xs font-medium text-slate-700 m-0">₹{paymentTax}</Text></Column>
                                        </Row>
                                    </>
                                )}

                                {/* Total */}
                                <Row className="pt-4 mt-2 border-t border-slate-100">
                                    <Column className="text-right align-middle">
                                        <Text className="text-sm font-bold text-slate-500 m-0 mr-4">TOTAL PAID</Text>
                                    </Column>
                                    <Column className="text-right w-[30%] align-middle">
                                        <Text className="text-xl font-extrabold text-emerald-600 m-0">{amount}</Text>
                                    </Column>
                                </Row>
                            </Section>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-200 text-center">
                            <Text className="text-xs text-slate-500 m-0 leading-relaxed">
                                Thank you for choosing Campus Connect. <br />
                                For support, email <Link href="mailto:contact@campus-connect.co.in" className="text-emerald-600 font-medium no-underline hover:underline">contact@campus-connect.co.in</Link>
                            </Text>
                            <Text className="text-[11px] text-slate-400 mt-6 mb-0">
                                © {new Date().getFullYear()} Campus Connect Systems • Automated Invoice
                            </Text>
                        </div>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
