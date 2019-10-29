from setuptools import setup, find_packages

with open("README.md", "r") as readme_file:
    readme = readme_file.read()

requirements = ["Pillow>=4.2.1"]

setup(
    name="billToText",
    version="0.0.1",
    author="Saheed Akinbile",
    author_email="sakin070@uottawa.ca",
    description="A package to convert your Bills to text",
    long_description=readme,
    long_description_content_type="text/markdown",
    url="https://github.com/AndrewBuist/Capstone",
    packages=find_packages(),
    install_requires=requirements,
    classifiers=[
        "Programming Language :: Python :: 3.6",
        "License :: OSI Approved :: MIT License",
    ],
)
# CFLAGS='-stdlib=libc++' tesserocr==2.4.1