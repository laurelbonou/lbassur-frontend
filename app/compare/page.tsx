import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparisonTool from "@/components/ComparisonTool";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Comparer les Assurances au Bénin - LBASSUR",
    description: "Utilisez notre comparateur gratuit pour trouver la meilleure assurance Auto, Vie, Santé ou Moto au Bénin. Comparez les tarifs et garanties de tous les assureurs.",
    alternates: { canonical: "/compare" },
};

export default function ComparePage() {
    return (
        <main className="bg-black min-h-screen">
            <Navbar />
            <ComparisonTool />
            <Footer />
        </main>
    );
}

