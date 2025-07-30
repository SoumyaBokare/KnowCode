import random
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from datetime import datetime
import os
import matplotlib.pyplot as plt
import firebase_admin
from firebase_admin import credentials, db

class CropRecommendationSystem:
    def __init__(self, logo_path='agridrip_logo.png'):
        self.logo_path = logo_path
        self.initialize_firebase()

    def initialize_firebase(self):
        # Update the path to the Firebase credentials file
        cred = credentials.Certificate(r'C:\Users\soumy\OneDrive\Desktop\TY\HACKATHONS\AgriDrip\Dashboard\backend\finalparul-firebase-adminsdk-73r75-4f95b5914a.json')
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://finalparul-default-rtdb.asia-southeast1.firebasedatabase.app/'
        })

    def fetch_sensor_data(self):
        ref = db.reference('sensor_data')
        data = ref.get()
        print('Fetched sensor data:', data)  # Log the fetched data
        return data

    def generate_pdf_report(self, sensor_data, recommendation, graph_paths, averages):
        pdf_filename = f'AgriDrip_CropReport_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        doc = SimpleDocTemplate(pdf_filename, pagesize=letter)
        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            'TitleStyle', 
            parent=styles['Title'], 
            textColor=colors.HexColor('#2ecc71'),  # Green
            fontSize=16,
            spaceAfter=12
        )

        content = []

        # Logo
        if os.path.exists(self.logo_path):
            logo = Image(self.logo_path, width=2*inch, height=1*inch)
            content.append(logo)
            content.append(Spacer(1, 12))

        # Title
        content.append(Paragraph("Crop Recommendation Report", title_style))
        content.append(Spacer(1, 12))

        # Sensor Data Table
        table_data = [["Parameter", "Value"]] + [[str(key), str(value)] for key, value in sensor_data.items()]
        table_style = [
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2ecc71')),  # Green header
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0f4f0')),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]
        table = Table(table_data, colWidths=[2*inch, 4*inch])
        table.setStyle(table_style)
        content.append(table)
        content.append(Spacer(1, 12))

        # Averages Section
        content.append(Paragraph("Averages:", styles['Heading2']))
        averages_data = [
            ["Average Temperature", f"{averages['temperature']}°C"],
            ["Average Humidity", f"{averages['humidity']}%"],
            ["Average Rainfall", f"{averages['rainfall']} mm"]
        ]
        averages_table = Table(averages_data, colWidths=[2*inch, 4*inch])
        averages_table.setStyle(table_style)
        content.append(averages_table)
        content.append(Spacer(1, 12))

        # Recommendation Section
        content.append(Paragraph("Crop Recommendation:", styles['Heading2']))
        content.append(Paragraph(recommendation, styles['BodyText']))
        content.append(Spacer(1, 12))

        # Graphs
        for graph_path in graph_paths:
            if os.path.exists(graph_path):
                graph_image = Image(graph_path, width=6*inch, height=3*inch)
                content.append(graph_image)
                content.append(Spacer(1, 12))

        # Footer
        footer_style = ParagraphStyle(
            'FooterStyle',
            parent=styles['Normal'],
            textColor=colors.HexColor('#7c7c7c'),  # Gray
            fontSize=8,
            alignment=1  # Center alignment
        )
        content.append(Paragraph(f"© {datetime.now().year} AgriDrip - Precision Agriculture Solutions", footer_style))
        content.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", footer_style))

        # Build the PDF
        doc.build(content)
        print(f"Generated PDF: {pdf_filename}")
        return pdf_filename

    def analyze_crop_recommendation(self, sensor_data):
        try:
            print(f"Sensor data keys: {sensor_data.keys()}")
            
            # Safe data extraction
            moisture = sensor_data.get('soil_moisture', 0)
            temperature = sensor_data.get('temperature', 0)
            
            # Robust type conversion
            try:
                moisture = int(str(moisture).replace('%', '').strip())
                temperature = int(str(temperature).replace('°C', '').strip())
            except (ValueError, TypeError):
                moisture = 0
                temperature = 0
            
            if moisture < 40:
                return "Low soil moisture detected. Urgent irrigation required to prevent crop stress."
            elif 40 <= moisture < 60:
                return "Moderate soil moisture. Maintain current irrigation practices."
            else:
                return "Optimal soil moisture levels detected. Continue current agricultural practices."
        except Exception as e:
            print(f"Error in crop recommendation: {e}")
            return "Error: Unable to process sensor data"

    def calculate_averages(self, sensor_data_list):
        def safe_parse(value, default=0):
            try:
                return int(float(str(value).replace('°C', '').replace('%', '').replace(' mm', '').strip()))
            except (ValueError, TypeError):
                return default

        temperature_sum = sum(safe_parse(data.get('temperature')) for data in sensor_data_list)
        humidity_sum = sum(safe_parse(data.get('humidity')) for data in sensor_data_list)
        rainfall_sum = sum(safe_parse(data.get('rainfall')) for data in sensor_data_list)
        
        count = len(sensor_data_list)
        return {
            "temperature": round(temperature_sum / count, 2) if count > 0 else 0,
            "humidity": round(humidity_sum / count, 2) if count > 0 else 0,
            "rainfall": round(rainfall_sum / count, 2) if count > 0 else 0
        }

    def generate_graphs(self, sensor_data_list):
        graph_paths = []

        # Robust data filtering and cleaning
        def clean_numeric_value(value, default=0):
            try:
                return int(float(str(value).replace('°C', '').replace('%', '').replace(' mm', '').strip()))
            except (ValueError, TypeError):
                return default

        # Prepare cleaned data
        cleaned_data = []
        for data in sensor_data_list:
            cleaned_entry = {
                'temperature': clean_numeric_value(data.get('temperature')),
                'humidity': clean_numeric_value(data.get('humidity')),
                'rainfall': clean_numeric_value(data.get('rainfall')),
                'timestamp': datetime.now().strftime("%H:%M:%S")
            }
            cleaned_data.append(cleaned_entry)

        if not cleaned_data:
            return graph_paths

        # Generate separate graphs for temperature, humidity, and rainfall
        def create_graph(data, label, color, ylabel, filename):
            plt.figure(figsize=(10, 6))
            x_values = range(len(data))
            plt.plot(x_values, data, label=label, linewidth=2, color=color)
            plt.xlabel('Measurement Sequence')
            plt.ylabel(ylabel)
            plt.title(f'{label} Trends')
            plt.legend()
            plt.grid(True, linestyle='--', alpha=0.7)
            plt.tight_layout()
            graph_path = f'{filename}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
            plt.savefig(graph_path)
            plt.close()
            print(f"Generated graph: {graph_path}")  # Log the generated graph path
            return graph_path

        temperatures = [data['temperature'] for data in cleaned_data]
        humidities = [data['humidity'] for data in cleaned_data]
        rainfalls = [data['rainfall'] for data in cleaned_data]

        graph_paths.append(create_graph(temperatures, 'Temperature (°C)', 'red', 'Temperature (°C)', 'temperature_graph'))
        graph_paths.append(create_graph(humidities, 'Humidity (%)', 'blue', 'Humidity (%)', 'humidity_graph'))
        graph_paths.append(create_graph(rainfalls, 'Rainfall (mm)', 'green', 'Rainfall (mm)', 'rainfall_graph'))

        return graph_paths

    def run(self, num_reports=3):
        try:
            sensor_data = self.fetch_sensor_data()
            
            # Convert sensor_data to a list if it's a dictionary
            if isinstance(sensor_data, dict):
                sensor_data_list = list(sensor_data.values())
            elif sensor_data is None:
                print("No sensor data found!")
                return
            else:
                sensor_data_list = [sensor_data]

            for i in range(min(num_reports, len(sensor_data_list))):
                print(f"\n--- Report {i+1} ---")
                current_data = sensor_data_list[i]
                recommendation = self.analyze_crop_recommendation(current_data)
                averages = self.calculate_averages(sensor_data_list[:i+1])
                graph_paths = self.generate_graphs(sensor_data_list[:i+1])
                self.generate_pdf_report(current_data, recommendation, graph_paths, averages)
        except Exception as e:
            print(f"Error in run method: {e}")
            import traceback
            traceback.print_exc()

# Example usage
if __name__ == "__main__":
    system = CropRecommendationSystem(logo_path='agridrip_logo.png')
    system.run()