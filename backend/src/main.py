from flask import Flask, escape, request, jsonify, abort
#import magic
import os
from werkzeug.utils import secure_filename
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "/photos"
app.config['MAX_CONTENT_LENGTH'] = 4 * 1024 * 1024

from werkzeug.exceptions import default_exceptions, HTTPException

@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return jsonify(error=str(e)), code

for ex in default_exceptions:
    app.register_error_handler(ex, handle_error)

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_file():
    token = request.form.get('upload_token')
    if not token or os.environ['UPLOAD_TOKEN'] != token:
        abort(400,'Bad upload_token')
    if 'file' not in request.files:
        abort(400, 'file required in request files')
    file = request.files['file']
    if file.filename == '':
       abort(400, 'filename required in request.files.file')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return 'File successfully uploaded'
    else:
        abort(400,'Allowed file types are txt, pdf, png, jpg, jpeg, gif')

