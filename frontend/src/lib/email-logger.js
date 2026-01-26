import { createServerClient } from "@/lib/supabase";

/**
 * Logs an email event to the database.
 * @param {Object} params
 * @param {string} params.recipient - Email address of the recipient
 * @param {string} params.type - Type of email (promotion, onboarding, etc.)
 * @param {string} params.subject - Subject line
 * @param {string} params.status - Status of the email (default: 'sent')
 * @param {Object} params.metadata - Additional data (e.g., mentorName)
 */
export async function logEmail({ recipient, type, subject, status = "sent", metadata = {} }) {
    try {
        const supabase = createServerClient();
        if (!supabase) {
            console.warn("Skipping email logging: Supabase not configured");
            return;
        }

        const { error } = await supabase
            .from("email_logs")
            .insert({
                recipient,
                type,
                subject,
                status,
                metadata
            });

        if (error) {
            console.error("Failed to insert email log:", error);
        } else {
            console.log(`Logged email: ${type} -> ${recipient}`);
        }
    } catch (err) {
        console.error("Error in logEmail:", err);
    }
}
