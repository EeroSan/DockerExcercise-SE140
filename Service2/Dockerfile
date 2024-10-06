FROM python:3.9-slim

WORKDIR /app
COPY . /app
RUN pip install flask psutil

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run app.py when the container launches
CMD ["python", "app.py"]