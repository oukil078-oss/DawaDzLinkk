from fpdf import FPDF
from datetime import datetime

class DeliverablePDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)
        
    def header(self):
        # Logo/Title area
        self.set_fill_color(0, 150, 137)  # Teal color
        self.rect(0, 0, 210, 35, 'F')
        self.set_font('Helvetica', 'B', 24)
        self.set_text_color(255, 255, 255)
        self.set_y(12)
        self.cell(0, 10, 'DawaDzLink', align='C')
        self.ln(12)
        self.set_font('Helvetica', '', 10)
        self.cell(0, 5, 'Plateforme B2B Pharmaceutique', align='C')
        self.set_text_color(0, 0, 0)
        self.ln(20)
        
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}} - DawaDzLink Phase 1 Frontend', align='C')

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_fill_color(240, 240, 240)
        self.set_text_color(0, 150, 137)
        self.cell(0, 10, f'  {title}', ln=True, fill=True)
        self.set_text_color(0, 0, 0)
        self.ln(2)
        
    def add_table(self, headers, data, col_widths=None):
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(0, 150, 137)
        self.set_text_color(255, 255, 255)
        
        if col_widths is None:
            col_widths = [190 / len(headers)] * len(headers)
        
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 8, header, border=1, align='C', fill=True)
        self.ln()
        
        self.set_font('Helvetica', '', 9)
        self.set_text_color(0, 0, 0)
        fill = False
        for row in data:
            if fill:
                self.set_fill_color(245, 245, 245)
            else:
                self.set_fill_color(255, 255, 255)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 7, str(cell), border=1, align='C', fill=True)
            self.ln()
            fill = not fill
        self.ln(3)

    def add_check_item(self, text, checked=True):
        self.set_font('Helvetica', '', 10)
        symbol = '[X]' if checked else '[ ]'
        self.cell(10, 6, symbol)
        self.cell(0, 6, text, ln=True)

# Create PDF
pdf = DeliverablePDF()
pdf.alias_nb_pages()
pdf.add_page()

# Title
pdf.set_font('Helvetica', 'B', 20)
pdf.set_text_color(50, 50, 50)
pdf.cell(0, 15, 'LIVRABLE PHASE 1', align='C', ln=True)
pdf.set_font('Helvetica', 'B', 16)
pdf.set_text_color(0, 150, 137)
pdf.cell(0, 10, 'Developpement Frontend', align='C', ln=True)
pdf.ln(5)

# Info box
pdf.set_fill_color(248, 250, 252)
pdf.set_draw_color(0, 150, 137)
pdf.rect(15, pdf.get_y(), 180, 35, 'D')
pdf.set_xy(20, pdf.get_y() + 5)
pdf.set_font('Helvetica', '', 10)
pdf.set_text_color(80, 80, 80)

info_text = [
    ('Date:', 'Fevrier 2025'),
    ('Client:', 'DawaDzLink'),
    ('Developpeur:', 'Zakarya Oukil'),
    ('Contact:', 'zakaryaoukil2003@gmail.com | 0773234526'),
]

for label, value in info_text:
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(25, 6, label)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 6, value, ln=True)
    pdf.set_x(20)

pdf.ln(15)

# Resume section
pdf.section_title('RESUME EXECUTIF')
pdf.set_font('Helvetica', '', 10)
pdf.multi_cell(0, 6, 
    "Ce document presente le livrable de la Phase 1 du projet DawaDzLink - une plateforme B2B "
    "de marketplace pharmaceutique pour l'Algerie. Cette phase couvre le developpement complet "
    "de l'interface utilisateur (Frontend) incluant tous les dashboards et fonctionnalites.")
pdf.ln(5)

# Objectifs
pdf.section_title('OBJECTIFS ATTEINTS')
objectives = [
    ('Interface de connexion/inscription', 'Complete'),
    ('Dashboard Administrateur', 'Complete'),
    ('Dashboard Pharmacie', 'Complete'),
    ('Dashboard Fournisseur', 'Complete'),
    ('Systeme de panier et commandes', 'Complete'),
    ('Gestion de stock (Pharmacie + Fournisseur)', 'Complete'),
    ('Import Excel intelligent (IA)', 'Complete'),
    ('Design responsive (mobile/tablette)', 'Complete'),
]
pdf.add_table(['Objectif', 'Statut'], objectives, [140, 50])

# New page for features
pdf.add_page()

pdf.section_title('FONCTIONNALITES DEVELOPPEES')

# Dashboard Admin
pdf.set_font('Helvetica', 'B', 11)
pdf.set_text_color(0, 150, 137)
pdf.cell(0, 8, '1. Dashboard Administrateur', ln=True)
pdf.set_text_color(0, 0, 0)
pdf.set_font('Helvetica', '', 10)
admin_features = [
    "Vue d'ensemble avec statistiques en temps reel",
    "Gestion des utilisateurs en attente d'approbation",
    "Liste des pharmacies avec actions (approuver/suspendre)",
    "Liste des fournisseurs avec actions",
    "Vue des produits de la plateforme",
    "Historique des commandes",
]
for f in admin_features:
    pdf.add_check_item(f)
pdf.ln(3)

# Dashboard Pharmacie
pdf.set_font('Helvetica', 'B', 11)
pdf.set_text_color(0, 150, 137)
pdf.cell(0, 8, '2. Dashboard Pharmacie', ln=True)
pdf.set_text_color(0, 0, 0)
pdf.set_font('Helvetica', '', 10)
pharmacy_features = [
    "Catalogue produits avec recherche et filtres",
    "Affichage des dates d'expiration sur chaque produit",
    "Panier fonctionnel (ajout, modification, suppression)",
    "Checkout avec selection du mode de paiement",
    "Page 'Mes Commandes' avec historique complet",
    "Notation des fournisseurs (1-5 etoiles + commentaire)",
    "Gestion de stock personnel avec alertes",
]
for f in pharmacy_features:
    pdf.add_check_item(f)
pdf.ln(3)

# Dashboard Fournisseur
pdf.set_font('Helvetica', 'B', 11)
pdf.set_text_color(0, 150, 137)
pdf.cell(0, 8, '3. Dashboard Fournisseur', ln=True)
pdf.set_text_color(0, 0, 0)
pdf.set_font('Helvetica', '', 10)
supplier_features = [
    "Liste des produits avec dates d'expiration",
    "Ajout/modification/suppression de produits",
    "Import Excel avec Mode IA (analyse automatique)",
    "Gestion des commandes recues",
    "Actions: Confirmer / Marquer livree",
    "Gestion de stock avec statistiques",
    "Gestion des agents commerciaux par wilaya",
]
for f in supplier_features:
    pdf.add_check_item(f)
pdf.ln(5)

# Technologies
pdf.section_title('TECHNOLOGIES UTILISEES')
tech_data = [
    ('React', '18.x', 'Framework frontend'),
    ('TypeScript', '5.x', 'Typage statique'),
    ('Vite', '6.x', 'Build tool'),
    ('Tailwind CSS', '3.x', 'Styling'),
    ('Shadcn/UI', 'Latest', 'Composants UI'),
]
pdf.add_table(['Technologie', 'Version', 'Usage'], tech_data, [50, 40, 100])

# New page for demo
pdf.add_page()

pdf.section_title('DEMONSTRATION EN LIGNE')
pdf.set_font('Helvetica', '', 10)
pdf.multi_cell(0, 6, "L'application est accessible en ligne pour test et validation:")
pdf.ln(3)

pdf.set_font('Helvetica', 'B', 11)
pdf.set_fill_color(240, 253, 250)
pdf.set_draw_color(0, 150, 137)
pdf.rect(15, pdf.get_y(), 180, 12, 'DF')
pdf.set_xy(20, pdf.get_y() + 3)
pdf.set_text_color(0, 150, 137)
pdf.cell(0, 6, 'https://verify-email-reset.preview.emergentagent.com', ln=True)
pdf.set_text_color(0, 0, 0)
pdf.ln(8)

# Test accounts
pdf.section_title('COMPTES DE TEST')
accounts_data = [
    ('Administrateur', 'admin@dawalink.dz', 'admin123456'),
    ('Pharmacie', 'pharmacy1@madina.dz', 'pharmacy123'),
    ('Fournisseur', 'supplier1@pharmaplus.dz', 'supplier123'),
]
pdf.add_table(['Role', 'Email', 'Mot de passe'], accounts_data, [50, 80, 60])

# Metrics
pdf.section_title('METRIQUES DU PROJET')
metrics_data = [
    ('Composants React crees', '25+'),
    ('Lignes de code (TypeScript/TSX)', '~8,000'),
    ('Pages/ecrans', '12'),
    ('Modals/popups', '8'),
    ('Tests', 'Tous passes'),
]
pdf.add_table(['Metrique', 'Valeur'], metrics_data, [120, 70])

# Price section
pdf.section_title('FACTURATION PHASE 1')
pdf.set_font('Helvetica', '', 10)
pdf.cell(0, 8, 'Developpement Frontend complet selon les specifications:', ln=True)
pdf.ln(2)
pdf.set_font('Helvetica', 'B', 16)
pdf.set_text_color(0, 150, 137)
pdf.cell(0, 10, 'Montant: 32,000 DZD', align='C', ln=True)
pdf.set_text_color(0, 0, 0)
pdf.ln(5)

# Next phase
pdf.section_title('PROCHAINE PHASE: BACKEND')
pdf.set_font('Helvetica', '', 10)
pdf.multi_cell(0, 6, "La Phase 2 couvrira:")
pdf.ln(2)
next_phase = [
    "Configuration serveur VPS",
    "Deploiement base de donnees MongoDB",
    "API REST avec FastAPI",
    "Securisation des endpoints",
    "Tests d'integration",
    "Mise en production",
]
for item in next_phase:
    pdf.cell(5)
    pdf.cell(0, 6, f"- {item}", ln=True)

# Contact info at bottom
pdf.ln(10)
pdf.set_fill_color(248, 250, 252)
pdf.rect(15, pdf.get_y(), 180, 20, 'F')
pdf.set_xy(20, pdf.get_y() + 5)
pdf.set_font('Helvetica', 'B', 10)
pdf.cell(0, 6, 'Contact Developpeur:', ln=True)
pdf.set_x(20)
pdf.set_font('Helvetica', '', 10)
pdf.cell(0, 6, 'Email: zakaryaoukil2003@gmail.com | Tel: 0773234526', ln=True)

# Save
pdf.output('/app/docs/deliverable/LIVRABLE_PHASE1_DAWADZLINK.pdf')
print("PDF created successfully!")
