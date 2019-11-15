FROM ubuntu:18.04
RUN apt-get update \
    && apt-get install python3 -y \
    python-setuptools \
    libleptonica-dev \
    libtesseract-dev \
    tesseract-ocr \
    python3-pip \
    pkg-config \
    && apt-get clean \
    && apt-get autoremove

ADD . /backend
WORKDIR /backend
COPY requirements.txt ./
#COPY /backend ./
#WORKDIR /backend
RUN pip3 install -r requirements.txt
CMD ["bash", "pwd"]
CMD ["python3","backend/RestfulDevServer.py"]