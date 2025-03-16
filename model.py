import numpy as np  
import pandas as pd  
import os  
import random  
import matplotlib.pyplot as plt  
import tensorflow as tf  
from matplotlib.image import imread  
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img  
from tensorflow.keras.models import Sequential, load_model  
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D, Dropout  
from tensorflow.keras.optimizers import Adam  

dataset_path = './data/data'  

train_folder = 'train'  
test_folder = 'test'  

IMAGE_HEIGHT = 32  
IMAGE_WIDTH = 32  

train_gen = ImageDataGenerator(rescale=1.0 / 255)  
test_gen = ImageDataGenerator(rescale=1.0 / 255)  

train_dataset = train_gen.flow_from_directory(
    batch_size=100,  
    directory=os.path.join(dataset_path, train_folder),  
    class_mode='sparse',  
    shuffle=True,  
    target_size=(IMAGE_HEIGHT, IMAGE_WIDTH)  
)

test_dataset = test_gen.flow_from_directory(
    batch_size=100,  
    directory=os.path.join(dataset_path, test_folder),  
    class_mode='sparse',  
    shuffle=False,  
    target_size=(IMAGE_HEIGHT, IMAGE_WIDTH)  
)

NUM_CLASSES = train_dataset.num_classes  
print(f'Liczba klas: {NUM_CLASSES}')  
