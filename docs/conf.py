# conf.py - Sphinx configuration file for ScrapeBnB documentation

import os
import sys

# Add the project root directory to the Python path for autodoc
sys.path.insert(0, os.path.abspath('../'))

# Project information
project = 'ScrapeBnB'
author = 'Michael Adrian'
copyright = '2024, Michael Adrian'
release = '1.1.4'

# General configuration
extensions = [
    'sphinx.ext.autodoc',    # Automatically document from docstrings
    'sphinx.ext.napoleon',   # Support for Google style docstrings
    'sphinx.ext.viewcode',   # Add links to source code
    'sphinx.ext.todo',       # Support for TODOs
]

# Templates path
templates_path = ['_templates']

# Exclude patterns for files
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# HTML output configuration
html_theme = 'alabaster'  # You can choose another theme if you prefer
html_static_path = ['_static']

# Options for autodoc
autodoc_member_order = 'bysource'

# Napoleon settings for Google and NumPy style docstrings
napoleon_google_docstring = True
napoleon_numpy_docstring = False

# Enable TODOs (you can remove this if you don't plan to use TODOs in the docs)
todo_include_todos = True

# Custom sidebar configuration (optional, for alabaster theme)
html_sidebars = {
    '**': [
        'about.html',
        'navigation.html',
        'searchbox.html',
    ]
}
