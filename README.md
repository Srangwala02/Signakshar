# Signakshar - Digital Signature Solution

## Project Overview
Signakshar is a digital signature solution designed to streamline the process of signing documents. Users can upload documents, specify the positions where one or multiple recipients need to sign or place logos, and then send the document for signing either sequentially (one after the other) or in parallel (all recipients at once). After all signatures are collected, users can view the fully signed document.

## Key Features
- **Document Upload**: Easily upload documents that need to be signed.
- **Signature Placement**: Define specific areas on the document where each recipient needs to sign or place their logo.
- **Sequential Signing**: Send the document to recipients one by one in a specific order, ensuring each signature is collected in sequence.
- **Parallel Signing**: Send the document to all recipients simultaneously, allowing them to sign at their convenience.
- **View Signed Document**: After all signatures are collected, users can view and download the fully signed document.

## Technologies Used
- **Backend**: Python Django
- **Database**: MySQL
- **Frontend**: React.js
- **Others**: HTML, CSS, JavaScript

## How It Works
1. **Upload Document**: Start by uploading the document that requires signatures.
2. **Set Signature Positions**: Drag and drop or select specific areas on the document for each recipient to sign or place their logo.
3. **Choose Signing Method**:
   - **Sequential**: Send the document to recipients in a specific order.
   - **Parallel**: Send the document to all recipients at once.
4. **Send Document**: The document is sent out for signing based on the selected method.
5. **View Signed Document**: Once all signatures are collected, the final signed document is available for viewing and download.

## Installation and Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/signakshar.git
   cd signakshar
  ```

2. **Backend Setup**:

- Make sure you have Python and Django installed.
- Install Python dependencies:
```bash
pip install -r requirements.txt
```

- Set up the MySQL database and update the settings.py file with your database credentials.

3. **Frontend Setup**:

- Make sure you have Node.js and npm installed.
- Navigate to the frontend directory and install required dependencies:
```bash
cd frontend
npm install
```

4. **Run the Application**:

- Start the Django server:
```bash
python manage.py runserver
```

- Start the React development server:
```bash
npm start
```
- Open your browser and navigate to http://localhost:3000 for the frontend and http://localhost:8000 for the backend.

## Usage
- Upload a Document: Navigate to the upload section and select the document you wish to be signed.
- Set Signature Positions: Use the interactive document viewer to set where each recipient should sign or place their logo.
- Send for Signing: Choose between sequential or parallel signing and send the document.
- Monitor Progress: Track the signing status and view the final signed document once all signatures are completed.

## Future Enhancements
- Integration with Cloud Storage: Allow users to save and manage their signed documents in cloud storage solutions like Google Drive or Dropbox.
- Mobile App: Develop a mobile application to make signing documents on the go easier.
- Advanced Security Features: Implement additional security measures, such as multi-factor authentication and encryption, to ensure the integrity and confidentiality of signed documents.
